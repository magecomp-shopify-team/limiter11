<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class SettingsController extends Controller
{
    public function setSettings(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->limit_publish_status = $request->status ? true : false;
            $user->save();
        } else {
            User::create([
                'shop_id' => $user->id,
                'limit_publish_status' => $request->status ? true : false,
            ]);
        }

        return response()->json([
            'status' => 1,
            'data' => [
                'message' => 'Settings save successfully',
                "shop" => $user
            ]
        ]);
    }
    public function getSettings(Request $request)
    {
        $user = Auth::user();

        return response()->json([
            'status' => 1,
            'data' => [
                'message' => 'Settings save successfully',
                "shop" => $user
            ]
        ]);
    }
}
