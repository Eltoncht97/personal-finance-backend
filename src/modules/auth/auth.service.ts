import * as argon2 from 'argon2';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../users/repositories/interfaces/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        `User with email ${dto.email} already registered`,
      );
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await argon2.verify(
      existingUser.passwordHash,
      dto.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    };
  }
}
