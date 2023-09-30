import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from 'src/auth/dto/sign-up.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private logger = new Logger('UsersService');

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const user = this.userRepository.create(signUpInput);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  disable(id: string) {
    return `This action removes a #${id} user`;
  }

  private exceptionHandler(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('User email already exists');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
