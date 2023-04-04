import { IsDate, IsNotEmpty, IsEmpty } from 'class-validator';
import { MealType } from '@meal/interface/meal.interface';

export class MealDto {
  @IsNotEmpty() id: string;
  @IsNotEmpty() @IsDate() date: Date;
  @IsNotEmpty() type: MealType;
  @IsNotEmpty() menu: string;
  ownerId?: string;
}
