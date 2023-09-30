import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type Role = 'Admin' | 'User';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  lastname: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  // @Field(() => String)
  @Column()
  password: string;

  @Field(() => String)
  @Column({ default: 'User' })
  role: Role;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;
}
