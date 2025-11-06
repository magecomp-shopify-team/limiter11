<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Osiset\ShopifyApp\Storage\Models\Plan;

class FrontendController extends Controller
{
    public function react()
    {
        $user = Auth::user();
        $planConfig = Plan::all();
        return view("app", ["user" => $user, "planConfig" => $planConfig]);
    }
}
