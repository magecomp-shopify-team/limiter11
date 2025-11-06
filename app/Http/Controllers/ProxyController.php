<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\ModelDesign;
use Illuminate\Support\Facades\Storage;

class ProxyController extends Controller
{
    public function indexProxy(Request $request)
    {
        $designcode = '';
        $shop = $request->shop;
        $user = User::where('name', $shop)->first();
        $model = ModelDesign::where('user_id', $user->id)->first();
        if ($model) {
            $designcode = $model->designcode;
        }

        if (!$user) { // || ($session && !$session->plan_id)
            return response('{% layout none %}{}', 200, [
                'Content-Type' => 'application/liquid'
            ]);
        }
        $filePath = 'rules/' . $shop . '/rules.json';
        if (Storage::exists($filePath) && $user->limit_publish_status) {

            $filePath = Storage::get($filePath);
            $fileData = Storage::get('liquid/add_block.liquid');
            $rules = json_decode($filePath, true);
            $fileData = str_replace('{*rules*}', json_encode($rules), $fileData);
            $fileData = str_replace('{*designcode*}', json_encode($designcode), $fileData);
            return response($fileData, 200, [
                'Content-Type' => 'application/liquid'
            ]);
        } else {
            return response('{% layout none %}{}', 200, headers: [
                'Content-Type' => 'application/liquid'
            ]);
        }
    }
}
