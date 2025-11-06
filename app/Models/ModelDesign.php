<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelDesign extends Model
{
    use HasFactory;

    protected $table = 'model_design';

    protected $fillable = [
        'user_id',
        'designcode',
    ];
}
