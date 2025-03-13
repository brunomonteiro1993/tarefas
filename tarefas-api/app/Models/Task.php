<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    // Certifique-se de que os campos necessários estão no array $fillable
    protected $fillable = [
        'title',
        'description',
        'color',
        'is_favorite',
    ];

    // Ou, se estiver usando $guarded, certifique-se de que nada está impedindo a atualização
    // protected $guarded = [];
}