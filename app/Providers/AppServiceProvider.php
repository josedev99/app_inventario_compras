<?php

namespace App\Providers;

use App\Models\Compras\Compra;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        require_once app_path('Helpers/globalLogo.php');
        Inertia::share([
            'appLogo' => asset('assets/img/kaiadmin/grupo.png'),
            'auth' => function () {
                $user = auth()->user();
                return [
                    'user' => $user,
                    'permissions' => optional($user)->getAllPermissions()?->pluck('name') ?? [],
                ];
            },
            'compraspendientes' => function () {
                return Compra::where('estado', 'PENDIENTE')->count();
            },
            'comprasFinanzas' => function () {
                return Compra::where('estado', 'PENDIENTE')
                    ->where('enviado_a_finanzas', true)
                    ->count();
            }
        ]);
    }
}
