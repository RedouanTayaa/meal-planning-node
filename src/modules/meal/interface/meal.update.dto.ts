import { IsNotEmpty, IsEmpty, IsEnum } from 'class-validator';
import { MealType } from '@meal/interface/meal.interface';
import { UserEntity } from '@user/entity/user.entity';

export class UpdateMealDto {
  @IsNotEmpty() id: string;
  @IsNotEmpty() date: string;
  @IsNotEmpty() @IsEnum(MealType) type: MealType;
  @IsNotEmpty() menu: string;
  @IsEmpty() owner: UserEntity;
}
