import { pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';

export const prerender = true;

export const load = async ({ url }) => {
    // List of public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/view'];
    const isPublicRoute = publicRoutes.includes(url.pathname);
    const isRootPath = url.pathname === '/';
    

    // Check if user is authenticated
    const isAuthenticated = pb.authStore.isValid;

    // If authenticated and on a public route, redirect to home
    if (isAuthenticated && isPublicRoute && !isRootPath) {
        console.log('redirect to home');
        goto(url);
        // throw redirect(303, '/');
    }

    // If not authenticated and on a protected route (excluding root path)
    if (!isAuthenticated && !isPublicRoute) {
        throw redirect(303, '/login');
    }

    return {
        user: pb.authStore.model,
        isAuthenticated
    };
}; 