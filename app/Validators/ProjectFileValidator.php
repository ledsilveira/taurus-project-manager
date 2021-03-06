<?php
/**
 * Created by PhpStorm.
 * User: LED
 * Date: 27/09/2015
 * Time: 21:58
 */

namespace CodeProject\Validators;


use Prettus\Validator\Contracts\ValidatorInterface;
use Prettus\Validator\LaravelValidator;

class ProjectFileValidator extends LaravelValidator
{
    protected $rules = [
        ValidatorInterface::RULE_CREATE => [
            'project_id' => 'required',
            'name' => 'required',
            'file' => 'required|mimes:jpeg,jpg,png,gif,pdf,zip',
            'description' => 'required',
        ],
        ValidatorInterface::RULE_UPDATE => [
            'project_id' => 'required',
            'name' => 'required',
            'description' => 'required',
        ]

    ];

}