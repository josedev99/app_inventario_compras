<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class ConfiguracionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Role::create(['ROOT']);
        Role::create(['FINANCIERO']);
        Role::create(['PROVEEDURIA']);
        Role::create(['BODEGA']);

        User::create([]);
    }
}
