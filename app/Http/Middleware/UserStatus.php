<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserStatus
{

    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user) {
            if ($user->status == 'Active') {
                return $next($request);
            }
        }

        return redirect('/notaccess');
    }
}
