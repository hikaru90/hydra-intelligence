import { pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const prerender = true;

export const load = async ({ url }) => {
    // List of public routes that don't require authentication
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(url.pathname);
    const isRootPath = url.pathname === '/';

    // Check if user is authenticated
    const isAuthenticated = pb.authStore.isValid;

    // If authenticated and on a public route, redirect to home
    if (isAuthenticated && isPublicRoute) {
        throw redirect(303, '/');
    }

    // If not authenticated and on a protected route (excluding root path)
    if (!isAuthenticated && !isPublicRoute && !isRootPath) {
        throw redirect(303, '/login');
    }

    return {
        user: pb.authStore.model,
        isAuthenticated
    };
}; 