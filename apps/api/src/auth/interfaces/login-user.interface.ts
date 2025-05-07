import { User } from '@repo/database';

interface LoginUserInterface {
  data: User;
  tokens: {
    session_token: string;
    access_token: string;
    refresh_token: string;
  };
}

export default LoginUserInterface;
