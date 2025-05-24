<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnidadMedidaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('unidad_medida')->insert([
            ['codigo' => 1, 'nombre' => 'metro'],
            ['codigo' => 2, 'nombre' => 'Yarda'],
            ['codigo' => 6, 'nombre' => 'milímetro'],
            ['codigo' => 9, 'nombre' => 'kilómetro cuadrado'],
            ['codigo' => 10, 'nombre' => 'Hectárea'],
            ['codigo' => 13, 'nombre' => 'metro cuadrado'],
            ['codigo' => 15, 'nombre' => 'Vara cuadrada'],
            ['codigo' => 18, 'nombre' => 'metro cúbico'],
            ['codigo' => 20, 'nombre' => 'Barril'],
            ['codigo' => 22, 'nombre' => 'Galón'],
            ['codigo' => 23, 'nombre' => 'Litro'],
            ['codigo' => 24, 'nombre' => 'Botella'],
            ['codigo' => 26, 'nombre' => 'Mililitro'],
            ['codigo' => 30, 'nombre' => 'Tonelada'],
            ['codigo' => 32, 'nombre' => 'Quintal'],
            ['codigo' => 33, 'nombre' => 'Arroba'],
            ['codigo' => 34, 'nombre' => 'kilogramo'],
            ['codigo' => 36, 'nombre' => 'Libra'],
            ['codigo' => 37, 'nombre' => 'Onza troy'],
            ['codigo' => 38, 'nombre' => 'Onza'],
            ['codigo' => 39, 'nombre' => 'Gramo'],
            ['codigo' => 40, 'nombre' => 'Miligramo'],
            ['codigo' => 42, 'nombre' => 'Megawatt'],
            ['codigo' => 43, 'nombre' => 'Kilowatt'],
            ['codigo' => 44, 'nombre' => 'Watt'],
            ['codigo' => 45, 'nombre' => 'Megavoltio-amperio'],
            ['codigo' => 46, 'nombre' => 'Kilovoltio-amperio'],
            ['codigo' => 47, 'nombre' => 'Voltio-amperio'],
            ['codigo' => 49, 'nombre' => 'Gigawatt-hora'],
            ['codigo' => 50, 'nombre' => 'Megawatt-hora'],
            ['codigo' => 51, 'nombre' => 'Kilowatt-hora'],
            ['codigo' => 52, 'nombre' => 'Watt-hora'],
            ['codigo' => 53, 'nombre' => 'Kilovoltio'],
            ['codigo' => 54, 'nombre' => 'Voltio'],
            ['codigo' => 55, 'nombre' => 'Millar'],
            ['codigo' => 56, 'nombre' => 'Medio millar'],
            ['codigo' => 57, 'nombre' => 'Ciento'],
            ['codigo' => 58, 'nombre' => 'Docena'],
            ['codigo' => 59, 'nombre' => 'Unidad'],
            ['codigo' => 99, 'nombre' => 'Otra'],
        ]);
    }
}
