import { Roles } from '../enums';

export interface JwtTokenPayload {
  username: string;
  role: Roles;
}
