<?php

namespace App\Json;

use App\JsonFile\JsonFile;

class Rule extends JsonFile
{
    protected $json_file;

    protected $filable = [
        'user_id',
        'sms_type',
        'customer_id',
        'customer_phone'
    ];

    public function __construct($store_name)
    {
        $file = 'rules/'.$store_name . "/rules.json";
        $this->json_file = $file;
        parent::__construct($file);
    }
}
