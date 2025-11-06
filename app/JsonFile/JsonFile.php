<?php

namespace App\JsonFile;

use Illuminate\Support\Facades\Storage;

class JsonFile
{
    protected $file_path;

    function __construct($file_path)
    {
        $this->file_path = $file_path;
    }

    /**
     * get file data of file
     * @return Collection all record of file
     */
    public function getJsonData()
    {
        $file_data = "";
        if (self::fileExistsInStorage()) {
            $file_data = Storage::get($this->json_file);
        }
        $file_data = collect(json_decode($file_data));
        return $file_data;
    }

    /**
     * check if file Exists in storage.
     * @return boolean
     */
    public function fileExistsInStorage()
    {
        return Storage::disk('local')->exists($this->json_file);
    }

    /**
     * create or update file
     * @param Collection $file_content
     * @return boolean
     */
    public function saveOrCreateFile($file_content)
    {
        if (Storage::put($this->json_file, json_encode($file_content))) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * insert record in file
     * @param array $data
     * @return Collection
     */
    public function insert($data)
    {
        $data['id'] = time();
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');
        $data = collect($data);
        $file_content = self::getJsonData();
        if ($file_content->isNotEmpty()) {
            $file_content->push($data);
        } else {
            $file_content = collect([]);
            $file_content->push($data);
        }
        if (self::saveOrCreateFile($file_content)) {
            return $data;
        } else {
            return collect([]);
        }
    }

    /**
     * insert record in file
     * @param array $data
     * @param int $id
     * @return Collection
     */
    public function update($data, $id)
    {
        if (array_key_exists('id', $data)) {
            unset($data['id']);
        }
        $data = collect($data);
        $file_content = self::getJsonData();
        if ($file_content->isNotEmpty()) {
            $updateRecord = collect([]);
            foreach ($file_content as $record) {
                if ($record->id == $id) {
                    foreach ($data as $key => $value) {
                        $record->$key = $value;
                    }
                    $record->updated_at = date('Y-m-d H:i:s');
                    $updateRecord = $record;
                    break;
                }
            }
            if (self::saveOrCreateFile($file_content)) {
                return $updateRecord;
            } else {
                return collect([]);
            }
        } else {
            return collect([]);
        }
    }

    /**
     * update multiple or single record
     * @param array $data array of object has update
     * @param array $filter array which record update
     * @return Collection
     */
    public function updateWhere($data, $filter)
    {
        $file_content = self::getJsonData();
        if (array_key_exists('id', $data)) {
            unset($data['id']);
        }
        $updateRecords = collect([]);
        if ($file_content->isNotEmpty()) {
            foreach ($file_content as $file_record) {
                $is_update = 0;
                foreach ($filter as  $filter_key => $filter_value) {
                    if (is_array($filter_value)) {
                        in_array($file_record->$filter_key, $filter_value) && $is_update++;
                    } else {
                        $file_record->$filter_key == $filter_value && $is_update++;
                    }
                }
                if ($is_update == count($filter)) {
                    foreach ($data as $key => $value) {
                        $file_record->$key = $value;
                    }
                    $file_record->updated_at = date('Y-m-d H:i:s');
                    $updateRecords->push($file_record);
                }
            }

            if (self::saveOrCreateFile($file_content)) {
                return $updateRecords;
            } else {
                return collect([]);
            }
        } else {
            return $updateRecords;
        }
    }

    /**
     * Delete single or multiple record from the file
     * @param int|array $ids
     * @return boolean
     */
    public function delete($ids)
    {
        $file_content = self::getJsonData();
        $filtered_content = $file_content->reject(function ($record) use ($ids) {
            if (is_array($ids)) {
                return in_array($record->id, $ids);
            } else {
                return $record->id == $ids;
            }
        });
        if (self::saveOrCreateFile($filtered_content)) {
            return true;
        } else {
            return false;
        }
    }
}
