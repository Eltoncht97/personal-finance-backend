import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './repositories/interfaces/user.repository';
import { PrismaUserRepository } from './repositories/implementations/prisma-user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
