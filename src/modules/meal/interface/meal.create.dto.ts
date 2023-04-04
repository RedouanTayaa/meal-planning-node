import { IsEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { MealType } from '@meal/interface/meal.interface';
import { UserDto } from '@user/interface/user.dto';

export class CreateMealDto {
  @IsNotEmpty() date: string;
  @IsNotEmpty() @IsEnum(MealType) type: MealType;
  @IsNotEmpty() menu: string;
  @IsEmpty() owner: UserDto;
}
