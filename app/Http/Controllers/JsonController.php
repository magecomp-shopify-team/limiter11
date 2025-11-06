<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Json\Rule;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class JsonController extends Controller
{
    public function getRules(Request $request)
    {
        $shop = Auth::user()->name;
        $rule = new Rule($shop);
        $data = $rule->getJsonData();
        // $rule->saveOrCreateFile($data);
        return response()->json([
            'status' => 1,
            'data' => [
                'rules' => $data,
                'message' => 'Settings save successfully'
            ]
        ]);
    }

    public function saveRules(Request $request)
    {
        $shop = Auth::user()->name;
        $rule = new Rule($shop);
        $rule->saveOrCreateFile($request->data);
        $data = [];
        $data = $rule->getJsonData();

        return response()->json([
            'status' => 1,
            'data' => [
                'rules' => $data,
                'message' => 'Settings save successfully'
            ]
        ]);
    }
}
