import env from './env';

// Google Strategy
export const googleClientId = env('GOOGLE_CLIENT_ID');
export const googleClientSecret = env('GOOGLE_CLIENT_SECRET');
export const googleCallbackUrl = env('GOOGLE_CALLBACK_URL');

// GitHub Strategy
export const githubClientId = env('GITHUB_CLIENT_ID');
export const githubClientSecret = env('GITHUB_CLIENT_SECRET');
export const githubCallbackUrl = env('GITHUB_CALLBACK_URL');
