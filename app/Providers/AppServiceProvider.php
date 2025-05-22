<?php

namespace App\Providers;

use App\Models\Compras\Compra;
use App\Models\Pedido;
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
                return $user
                    ? [
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                        ],
                        'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                    ]
                    : null;
            },
            'compraspendientes' => function () {
                return Compra::where('estado', 'PENDIENTE')->count();
            },
            'comprasFinanzas' => function () {
                return Compra::where('estado', 'PENDIENTE')
                    ->where('enviado_a_finanzas', true)
                    ->count();
            },
            'counterPendingCompra' => function () {
                return Pedido::where('estado', 'Pendiente')
                    ->where('estado_envio', true)
                    ->count();
            }
        ]);
    }
}
