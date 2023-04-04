import { IsEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { MealType } from '@meal/interface/meal.interface';
import { UserDto } from '@user/interface/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMealDto {
  @ApiProperty()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ enum: ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER'] })
  @IsNotEmpty()
  @IsEnum(MealType)
  type: MealType;

  @ApiProperty()
  @IsNotEmpty()
  menu: string;

  @IsEmpty()
  owner?: UserDto;
}
