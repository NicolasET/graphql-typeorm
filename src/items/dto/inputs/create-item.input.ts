import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Int)
  @IsPositive()
  quantity: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  quantityUnits: string;
}
