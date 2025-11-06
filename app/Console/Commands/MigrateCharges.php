<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Charges;
use App\Models\User;
use Carbon\Carbon;


class MigrateCharges extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-charges';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all();
        foreach ($users as $user) {
            $api = $user->api();
            $this->info("Checking subscription for shop: " . $user->name);
            try {
                $query = <<<'GRAPHQL'
                {
                currentAppInstallation {
                    activeSubscriptions {
                    id
                    name
                    status
                    test
                    trialDays
                    createdAt
                    currentPeriodEnd
                    lineItems {
                        plan {
                        pricingDetails {
                            __typename
                            ... on AppRecurringPricing {
                            interval
                            price {
                                amount
                                currencyCode
                            }
                            }
                        }
                        }
                    }
                    }
                }
                }
                GRAPHQL;
                $res = $api->graph($query);
                $response = json_decode(json_encode($res), true);
                info($response, );
                $subscriptions = $response['body']['data']['currentAppInstallation']['activeSubscriptions'] ?? [];
                if (empty($subscriptions)) {
                    $this->warn("No subscription found for {$user->name}");
                    continue;
                }

                foreach ($subscriptions as $sub) {
                    if (strtolower($sub['status']) !== 'active') {
                        $this->warn("Skipping non-active subscription for {$user->name}");
                        continue;
                    }
                    $lineItem = $sub['lineItems'][0]['plan']['pricingDetails'] ?? null;
                    $price = $lineItem['price']['amount'] ?? 0;
                    $interval = $lineItem['interval'] ?? null;
                    $trialEndsOn = !empty($sub['trialDays']) ? Carbon::parse($sub['createdAt'])->addDays($sub['trialDays']) : null;
                    $id = $sub['id'];
                    $numericId = preg_replace('/\D/', '', $id);
                    Charges::updateOrCreate(
                        [
                            'charge_id' => $numericId,
                            'user_id' => $user->id,
                        ],
                        [
                            'test' => $sub['test'] ?? 0,
                            'status' => $sub['status'] ?? null,
                            'name' => $sub['name'] ?? null,
                            'terms' => null,
                            'type' => 'recurring_application_charge',
                            'price' => $price,
                            'interval' => $interval,
                            'capped_amount' => null,
                            'trial_days' => $sub['trialDays'] ?? null,
                            'billing_on' => !empty($sub['currentPeriodEnd']) ? Carbon::parse($sub['currentPeriodEnd']) : null,
                            'activated_on' => !empty($sub['createdAt']) ? Carbon::parse($sub['createdAt']) : null,
                            'trial_ends_on' => $trialEndsOn,
                            'cancelled_on' => null,
                            'expires_on' => !empty($sub['currentPeriodEnd']) ? Carbon::parse($sub['currentPeriodEnd']) : null,
                            'plan_id' => null,
                            'description' => null,
                            'reference_charge' => $numericId,
                        ]
                    );
                }

                // $this->info("Subscription updated for {$user->name}");
            } catch (\Exception $e) {
                $this->error("Error for {$user->name}: " . $e->getMessage());
            }
        }

        $this->info("✅ All subscriptions checked successfully.");

        // info("Migration completed. Processed {$count} sessions.");
        return 0;
    }
}
