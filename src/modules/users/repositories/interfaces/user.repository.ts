import { User } from '@prisma/client';
import { CreateUserData } from '../types/create-user-data.type';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(dto: CreateUserData): Promise<User | null>;
}
