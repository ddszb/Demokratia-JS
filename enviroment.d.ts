declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      GUILD_ID: string;
      enviroment: 'dev' | 'prod' | 'debug';
      MONGO_URL: string;
    }
  }
}
