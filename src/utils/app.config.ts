export default (): AppConfig => ({
  port: parseInt(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/test',
  node_env: process.env.NODE_ENV || 'development',
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    auth_url: process.env.FRONTEND_AUTH_URL || 'http://localhost:3000/auth',
  },
  auth: {
    jwt: {
      accessToken: {
        secret: process.env.JWT_ACCESSTOKEN_SECRET || 'secret',
        expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRES_IN || '1h',
      },
      refreshToken: {
        secret: process.env.JWT_REFRESHTOKEN_SECRET || 'anotherSECRET',
        expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRES_IN || '1w',
      },
    },
    authsch: {
      clientID: process.env.AUTHSCH_CLIENT_ID || 'authsch_client_id',
      clientSecret: process.env.AUTHSCH_CLIENT_SECRET || 'authsch_client_secret',
      callbackURL:
        process.env.AUTHSCH_CALLBACK_URL || 'http://localhost:3000/auth/authsch/callback',
    },
  },
});

export interface AppConfig {
  port: number;
  DATABASE_URL: string;

  auth: {
    jwt: {
      accessToken: {
        secret: string;
        expiresIn: string;
      };
      refreshToken: {
        secret: string;
        expiresIn: string;
      };
    };
    authsch: {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
    };
  };
  frontend: {
    url: string;
    auth_url: string;
  };
  'auth.jwt.accessToken.secret'?: string;
  'auth.jwt.accessToken.expiresIn'?: string;
  'auth.jwt.refreshToken.secret'?: string;
  'auth.jwt.refreshToken.expiresIn'?: string;
  'auth.authsch.clientID'?: string;
  'auth.authsch.clientSecret'?: string;
  'auth.authsch.callbackURL'?: string;
  'frontend.url'?: string;
  'frontend.auth_url'?: string;
  node_env: string;
}
