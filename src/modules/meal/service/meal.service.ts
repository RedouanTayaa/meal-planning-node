import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealEntity } from '@meal/entity/meal.entity';
import { UserEntity } from '@user/entity/user.entity';
import { BetweenDates, toMealDto, toMealWithOwnerDto } from '@shared/mapper';
import { UserDto } from '@user/interface/user.dto';
import { CreateMealDto } from '@meal/interface/meal.create.dto';
import { MealDto } from '@meal/interface/meal.dto';
import { UserService } from '@user/service/user.service';
import { UpdateMealDto } from '@meal/interface/meal.update.dto';
import { isDateString } from 'class-validator';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(MealEntity)
    private mealRepository: Repository<MealEntity>,
    private readonly usersService: UserService,
  ) {}

  async findOne(id: string): Promise<MealDto> {
    const meal = await this.mealRepository.findOne({
      where: {
        id: id,
      },
      relations: ['owner'],
    });

    return toMealWithOwnerDto(meal);
  }

  async findByUser(user: UserEntity): Promise<MealDto[]> {
    const meals = await this.mealRepository.find({
      where: {
        owner: { id: user.id },
      },
    });

    return this.mealsCollectionResource(meals);
  }

  async findByUserAndDate(
    user: UserEntity,
    begin: string,
    end: string,
  ): Promise<MealDto[]> {
    if (!isDateString(begin) || !isDateString(end)) {
      throw new HttpException(
        'The dates are not in the right format',
        HttpStatus.BAD_REQUEST,
      );
    }

    const meals = await this.mealRepository.find({
      where: {
        date: BetweenDates(begin, end),
        owner: { id: user.id },
      },
    });

    return this.mealsCollectionResource(meals);
  }

  async findSuggestion(user: UserEntity, search: string): Promise<string[]> {
    const meals = await this.mealRepository
      .createQueryBuilder('meal')
      .select('meal.menu')
      .distinctOn(['LOWER(meal.menu)'])
      .leftJoin('meal.owner', 'owner')
      .where('owner.id = :id', { id: user.id })
      .andWhere('LOWER(meal.menu) LIKE :search', { search: `%${search}%` })
      .limit(10)
      .getMany();

    return this.menuCollection(meals);
  }

  async create(mealDto: CreateMealDto): Promise<MealDto> {
    const { date, type, menu, owner } = mealDto;
    const user: UserDto = await this.usersService.findOne({
      where: { id: owner.id },
    });
    if (!user) {
      throw new HttpException('User did not exist', HttpStatus.BAD_REQUEST);
    }

    const mealInDb = await this.mealRepository.findOne({
      where: { date: new Date(date), type: type, owner: user },
    });
    if (mealInDb) {
      throw new HttpException('Meal already exists', HttpStatus.BAD_REQUEST);
    }

    const meal: MealEntity = this.mealRepository.create({
      date: date,
      type: type,
      menu: menu,
      owner: user,
    });
    await this.mealRepository.save(meal);

    return toMealDto(meal);
  }

  async update(mealDto: UpdateMealDto): Promise<MealDto> {
    const { id, date, type, menu, owner } = mealDto;

    const oldMeal = await this.findOne(id);

    if (oldMeal.ownerId !== owner.id) {
      throw new HttpException(
        'You are not authorize to edit this menu',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      new Date(oldMeal.date).getTime() !== new Date(date).getTime() ||
      oldMeal.type !== type
    ) {
      throw new HttpException(
        'You can simply edit the menu',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.mealRepository.update(mealDto.id, {
      id: id,
      date: new Date(date),
      type: type,
      menu: menu,
      owner: owner,
    });

    return { id: id, date: new Date(date), type: type, menu: menu };
  }

  async remove(owner: UserEntity, id: string): Promise<void> {
    const oldMeal = await this.findOne(id);

    if (oldMeal.ownerId !== owner.id) {
      throw new HttpException(
        'You are not authorize to remove this menu',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.mealRepository.delete(id);
  }

  private mealsCollectionResource(meals: MealEntity[]): MealDto[] {
    const success: MealDto[] = [];

    meals.forEach((meal) => {
      success.push(toMealDto(meal));
    });

    return success;
  }

  private menuCollection(meals: MealEntity[]): string[] {
    const success: string[] = [];

    meals.forEach((meal) => {
      success.push(meal.menu);
    });

    return success;
  }
}
