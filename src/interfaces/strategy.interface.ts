export interface IGoogleStrategy {
  id: string;
  provider: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture?: string;
}

export interface IGoogleOAuthClient {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export interface IGitHubStrategy {
  id: string;
  provider: string;
  email: string;
  verified: boolean;
  name: string;
  avatar_url: string;
}

export interface IGitHubOAuthClient {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}
