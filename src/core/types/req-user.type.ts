import { User } from '../entities';

export type ReqUser = Pick<User, 'id' | 'username' | 'email' | 'role'>;
