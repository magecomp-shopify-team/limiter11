<?php

namespace App\Models;

use App\Helper\PlanHelper;
use App\Object\Plan;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Shopify\Clients\Graphql;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'limit_publish_status'
    ];

    /**
     * Summary of graph
     * @param string $query
     * @param array|null $variables
     * @return array
     */
    
    /**
     * Select a plan
     * @param string $host
     * @param int $plan_id
     * @return string|null
     */
    public function selectPlan($host, $plan_id)
    {
        return PlanHelper::subscribeToPlan($this, $plan_id, $host);
    }

    /**
     * get Active plan
     * @return Plan
     */
    public function getActivePlan()
    {
        return PlanHelper::getShopPlan($this);
    }

    /**
     * Set active plan
     * @param Plan $plan
     * @return boolean
     */
    public function setActivePlan(Plan $plan)
    {
        $charge = Charge::where('user_id', $this->id)->first();
        if (!$charge) {
            $charge = new Charge();
            $charge->user_id = $this->id;
        }
        $charge->plan_name = $plan->getPlanName();
        $charge->charge_id = (string) $plan->getChargeId();
        $charge->price = (string) $plan->getPrice();
        $charge->save();
        $this->plan_id = (int) $plan->getPlanId();
        $this->save();
        return true;
    }

    /**
     * Set user other information
     * @return boolean
     */
    public function setUserInfo()
    {
        $getShopInfo = '{
            shop {
                name
                plan {
                    displayName
                    partnerDevelopment
                    shopifyPlus
                }
                email
                myshopifyDomain
                shopOwnerName
                ianaTimezone
                contactEmail
                currencyCode
                domains {
                    url
                }
                billingAddress {
                    country
                    phone
                }
            }
        }';

        $details = $this->graph($getShopInfo);
        if (isset($details['data']['shop'])) {
            $shopData = $details['data']['shop'];
            $this->user_first_name = isset($shopData['name']) ? $shopData['name'] : $this->user_first_name;
            $this->user_email = isset($shopData['contactEmail']) ? $shopData['contactEmail'] : $this->user_email;
            $this->user_last_name = isset($shopData['shopOwnerName']) ? $shopData['shopOwnerName'] : $this->user_last_name;
            if (isset($shopData['plan']['partnerDevelopment']) && $shopData['plan']['partnerDevelopment']) {
                $this->is_development = true;
            } else {
                $this->is_development = false;
            }
            $plan = $this->getActivePlan();
            if ($plan->getChargeId()) {
                $this->setActivePlan($plan);
            } else if ($this->plan_id != 1) {
                $this->plan_id = null;
            }
            $this->save();
            return true;
        }
        return false;
    }

    public function getAppStatus()
    {
        $active_theme_id = $this->getActiveThemeId();
        if (!$active_theme_id) {
            return false;
        }


        $query = 'query ($themeId: ID!, $fileNames: [String!], $fileLimit: Int) {
                    theme(id: $themeId) {
                        id
                        name
                        role
                        files(filenames: $fileNames, first: $fileLimit) {
                        nodes {
                            body {
                              ... on OnlineStoreThemeFileBodyText {
                                content
                              }
                            }
                          }
                        }
                      }
                    }';

        $themeDotLiquid = $this->graph($query, [
            'themeId' => $active_theme_id,
            'fileNames' => ["config/settings_data.json"],
            'fileLimit' => 1
        ]);
        $html = '[]';
        if (isset($themeDotLiquid['data']['theme']['files']['nodes'][0]['body']['content'])) {
            $html = $themeDotLiquid['data']['theme']['files']['nodes'][0]['body']['content'];
        }
        $json_string = preg_replace('/\/\*.*?\*\//s', '', $html);
        $json_array = json_decode($json_string, true);

        $current = isset($json_array['current']) ? $json_array['current'] : [];
        $type = 'shopify://apps/' . config('shopify.app_handle') . '/blocks/' . config('shopify.theme_uuid_url') . '/' . config('shopify.theme_uuid');
        $appStatus = false;
        if (isset($current['blocks'])) {
            foreach ($current['blocks'] as $block) {
                if ($type == $block['type']) {
                    $appStatus = !(bool) $block['disabled'];
                }
            }
        }
        return $appStatus;
    }

    public function getActiveThemeId()
    {
        $query = '{
                    themes(first: 1, roles: MAIN) {
                      nodes {
                        name
                        role
                        id
                      }
                    }
                  }';
        $themes = $this->graph($query);
        if (isset($themes['data']['themes']['nodes'][0]['id'])) {
            return $themes['data']['themes']['nodes'][0]['id'];
        }
        return null;
    }
}
