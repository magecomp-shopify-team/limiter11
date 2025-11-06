<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Osiset\ShopifyApp\Contracts\ShopModel as IShopModel;
use Osiset\ShopifyApp\Traits\ShopModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements IShopModel
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use ShopModel, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            // 'password' => 'hashed',
        ];
    }

    public function getAppStatus()
    {
        $shop = Auth::user();
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

        $themeDotLiquid = $shop->api()->graph($query, [
            'themeId' => $active_theme_id,
            'fileNames' => ["config/settings_data.json"],
            'fileLimit' => 1
        ]);
        $html = '[]';

        $container = $themeDotLiquid['body']->container ?? [];
        if (isset($container['data']['theme']['files']['nodes'][0]['body']['content'])) {
            $html = $container['data']['theme']['files']['nodes'][0]['body']['content'];
        }

        $json_string = preg_replace('/\/\*.*?\*\//s', '', $html);
        $json_array = json_decode($json_string, true);

        $current = isset($json_array['current']) ? $json_array['current'] : [];
        $type = 'shopify://apps/' . config('shopify-app.app_handle') . '/blocks/' . config('shopify-app.theme_uuid_url') . '/' . config('shopify-app.theme_uuid');
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
        $shop = Auth::user();
        $query = '{
                    themes(first: 1, roles: MAIN) {
                      nodes {
                        name
                        role
                        id
                      }
                    }
                  }';
        $themes = $shop->api()->graph($query);
        $body = $themes['body']->container ?? [];
        if (isset($body['data']['themes']['nodes'][0]['id'])) {
            return $body['data']['themes']['nodes'][0]['id'];
        }
        return null;
    }

}
