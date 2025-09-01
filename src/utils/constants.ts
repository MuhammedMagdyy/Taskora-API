export const SERVER = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TRUST_PROXY: 'trust proxy',
  DEFAULT_HOST: '127.0.0.1',
  DEFAULT_PORT_NUMBER: 8080,
  DEFAULT_MEMORY_MONITOR_INTERVAL_MS: 60000,
  HTML_RESPONSE: `
    <div style="text-align: center; margin-top: 20px;">
      <h1>Welcome to Taskora API 🚀</h1>
    </div>
  `,
  LOCALHOST_URLS: ['http://localhost:3000', 'http://localhost:5174'],
};

export const API_INTEGRATION = {
  GOOGLE: {
    USER_INFO_SCOPES: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    USER_INFO_URL: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  GITHUB: {
    TOKEN_URL: 'https://github.com/login/oauth/access_token',
    USER_INFO_URL: 'https://api.github.com/user',
    EMAILS_URL: 'https://api.github.com/user/emails',
    REVOKE_URL: (clientId: string) =>
      `https://api.github.com/applications/${clientId}/token`,
  },
};

export const MAGIC_NUMBERS = {
  ONE_MINUTE_IN_MILLISECONDS: 60 * 1000,
  ONE_DAY_IN_MILLISECONDS: 24 * 60 * 60 * 1000,
  ONE_WEEK_IN_MILLISECONDS: 7 * 24 * 60 * 60 * 1000,
  FIVE_SECONDS_IN_MILLISECONDS: 5 * 1000,
  FIVE_MINUTES_IN_MILLISECONDS: 5 * 60 * 1000,
  ONE_HOUR_IN_SECONDS: 60 * 60,
  ONE_DAY_IN_SECONDS: 24 * 60 * 60,
  FIVE_MINUTES_IN_SECONDS: 5 * 60,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_NUMBER_OF_RETRIES: 5,
  MAX_NUMBER_OF_CONCURRENT_JOBS: 5,
  MAX_COUNT_FOR_REMOVE_ON_COMPLETE: 100,
  MAX_COUNT_FOR_REMOVE_ON_FAILURE: 100,
  MAX_NUMBER_OF_ALLOWED_REQUESTS: {
    ONE: 1,
    THREE: 3,
    TEN: 10,
  },
};

export const DEFAULT_VALUES = {
  PROJECTS: {
    name: '🚀 First Launch',
    description:
      'Every great journey begins with a single step. Use this project to plan and achieve your first milestone!',
    color: '#007bff',
  },
  TASKS: {
    name: '📅 Plan Your Week',
    description:
      'Add your top three priorities for the week and start managing your time effectively',
  },
};

export const QUEUES = {
  EMAIL_QUEUE: 'EMAIL_QUEUE',
};

export const WORKERS = {
  SEND_VERIFICATION_EMAIL: 'SEND_VERIFICATION_EMAIL',
  SEND_FORGET_PASSWORD_EMAIL: 'SEND_FORGET_PASSWORD_EMAIL',
};
