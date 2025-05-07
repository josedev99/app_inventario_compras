<?php

namespace App\Providers;

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
            'auth' => function () {
                $user = auth()->user();
        
                return [
                    'user' => $user,
                    'permissions' => optional($user)->getAllPermissions()?->pluck('name') ?? [],
                ];
            },
        ]);        
    }
}
