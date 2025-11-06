<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ModelDesign;
class DesignController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $model = ModelDesign::where('user_id', $user->id)->first();
        if ($model) {
            $modelDesign = json_decode($model->designcode, true);

            return response()->json([
                'status' => 1,
                'modelDesign' => $modelDesign
            ]);
        }

        return response()->json([
            "status" => 0,
            'modelDesign' => []
        ]);
    }
    public function saveDesign(Request $request)
    {
        $user = Auth::user();

        if ($request->designModal) {
            $model = ModelDesign::where('user_id', $user->id)->first();
            $array = [
                'model_color' => $request->designModal['bgColor'],
                'model_border_color' => $request->designModal['borderColor'],
                'model_font_color' => $request->designModal['fontColor'],
                'font_size' => $request->designModal['fontSize'],
                'border_radius' => $request->designModal['borderRadius'],
                'model_z_index' => $request->designModal['zindex'],
            ];

            if ($model) {
                $model->designcode = json_encode($array);
                $model->save();

            } else {
                ModelDesign::create([
                    "user_id" => $user->id,
                    "designcode" => json_encode($array),
                ]);

            }
            return response()->json([
                'status' => 1,
                'message' => "Data Saved",
            ]);

        }
    }
}
