import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpInput, SignInInput } from './dto';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.userService.create({
      ...signUpInput,
      password: this.hashPassword(signUpInput.password),
    });
    const token = 'abc';

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

    const token = 'abc';
    return {
      user,
      token,
    };
  }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }
}
