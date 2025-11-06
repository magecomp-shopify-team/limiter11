<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ConvertDataFromSessionsToUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * Example: php artisan convert:sessions-to-users
     */
    protected $signature = 'convert:sessions-to-users';

    /**
     * The console command description.
     */
    protected $description = 'Convert data from sessions table to users table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sessions = DB::table('sessions')->get();

        if ($sessions->isEmpty()) {
            $this->info('No data found in sessions table.');
            return Command::SUCCESS;
        }

        foreach ($sessions as $session) {
            DB::table('users')->insert([
                'name' => $session->shop,
                'email' => null,
                'password' => $session->access_token ?? null,
                'created_at' => $session->created_at ?? null,
                'updated_at' => $session->updated_at ?? null,
                'limit_publish_status' => $session->limit_publish_status ?? null,
                'plan_id' => in_array($session->plan_id, [2, 3]) ? $session->plan_id : null,
                'mobile_promo' => $session->mobile_promo ?? null,
            ]);
        }

        $this->info('All sessions data converted to users table successfully!');
        return Command::SUCCESS;
    }
}
