import { Between } from 'typeorm';
import { UserEntity } from '@user/entity/user.entity';
import { UserDto } from '@user/interface/user.dto';
import { MealEntity } from '@meal/entity/meal.entity';
import { MealDto } from '@meal/interface/meal.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email, lastUpdate, refreshToken } = data;
  return { id, username, email, lastUpdate, refreshToken };
};

export const toMealDto = (data: MealEntity): MealDto => {
  const { id, date, type, menu } = data;
  return { id, date, type, menu };
};

export const toMealWithOwnerDto = (data: MealEntity): MealDto => {
  const {
    id,
    date,
    type,
    menu,
    owner: { id: ownerId },
  } = data;
  return { id, date, type, menu, ownerId };
};

export const BetweenDates = (from: Date | string, to: Date | string) =>
  Between(
    typeof from === 'string' ? new Date(from) : from,
    typeof to === 'string' ? new Date(to) : to,
  );
