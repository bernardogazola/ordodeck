import { Session } from '@repo/database';

export class UpdateRefreshTokenDto {
  session: Session;
  refresh_token: string;
}
