import { IsNotEmpty, IsEmpty, IsEnum } from 'class-validator';
import { MealType } from '@meal/interface/meal.interface';
import { UserEntity } from '@user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMealDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

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
  owner: UserEntity;
}
