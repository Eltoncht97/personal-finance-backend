import { Account } from '@prisma/client';
import { CreateAccountDto } from '../../dto/create-account.dto';
import { AccountRepository } from '../interfaces/account.repository';
import { PrismaService } from 'src/prisma/prisma.service';

export class PrismaAccountRepository extends AccountRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  findAllByUserId(id: string): Promise<Account[]> {
    return this.prismaService.account.findMany({
      where: { userId: id },
    });
  }

  create(dto: CreateAccountDto, userId: string): Promise<Account> {
    return this.prismaService.account.create({ data: { ...dto, userId } });
  }
}
