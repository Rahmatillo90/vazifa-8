declare;
namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    DATABASE_URL: string;
    SUPER_ADMIN_USERNAME: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    STRIPE_SECRET_KEY: string;
  }
}
