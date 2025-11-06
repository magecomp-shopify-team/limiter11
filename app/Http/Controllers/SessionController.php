<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Session;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class SessionController extends Controller
{
    public function getMobilePromo(Request $request)
    {
        $promoStatus = Auth::user()->mobile_promo ?? true;

        return response()->json([
            'status' => 1,
            'data' => $promoStatus ?? null,
        ]);
    }

    public function getAppStatus(Request $request)
    {
        $user = Auth::user();
        $userData = User::where("id", $user->id)->first();
        $appStatus = $userData->getAppStatus();

        return response()->json([
            'status' => 1,
            'appStatus' => $appStatus,
        ]);
    }

    public function closeMobilePromo(Request $request)
    {

        $user = Auth::user();
        $userData = User::where("id", $user->id)->first();

        if ($userData) {
            $userData->mobile_promo = $request->mobile_promo;
            $userData->save();
        }

        return response()->json([
            'status' => 1,
            'message' => 'Setting updated successfully',
        ]);
    }
}
