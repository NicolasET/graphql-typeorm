import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpInput, SignInInput } from './dto';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.userService.create({
      ...signUpInput,
      password: this.hashPassword(signUpInput.password),
    });
    const token = this.signJwt(user.id);

    return {
      token,
      user,
    };
  }

  async signIn(signInInput: SignInInput): Promise<AuthResponse> {
    const { email, password } = signInInput;
    const user = await this.userService.findOneByEmail(email);

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException();
    }

    const token = this.signJwt(user.id);

    return {
      user,
      token,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  private signJwt(userId: string): string {
    return this.jwtService.sign({ userId });
  }
}
