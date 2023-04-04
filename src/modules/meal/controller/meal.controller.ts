import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Query,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { MealService } from '@meal/service/meal.service';
import { AuthGuard } from '@auth/service/auth.guard';
import { CreateMealDto } from '@meal/interface/meal.create.dto';
import { MealDto } from '@meal/interface/meal.dto';
import { betweenDateRequest } from '@meal/interface/meal.interface';
import { UpdateMealDto } from '@meal/interface/meal.update.dto';

@Controller('meal')
@UseGuards(AuthGuard)
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  public async createMeal(
    @Request() req,
    @Body() createMealDto: CreateMealDto,
  ): Promise<MealDto> {
    createMealDto.owner = req.user;

    try {
      return await this.mealService.create(createMealDto);
    } catch {
      throw new HttpException(
        'Try again in a few minutes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  public async getMealBetweenDate(
    @Request() req,
    @Query() query: betweenDateRequest,
  ): Promise<MealDto[]> {
    return await this.mealService.findByUserAndDate(
      req.user,
      query.begin,
      query.end,
    );
  }

  @Put()
  public async updateMeal(
    @Request() req,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<MealDto> {
    updateMealDto.owner = req.user;

    try {
      return await this.mealService.update(updateMealDto);
    } catch {
      throw new HttpException(
        'Try again in a few minutes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('suggestion')
  public async getMenuSuggestion(
    @Request() req,
    @Query() query: { search: string },
  ): Promise<string[]> {
    return this.mealService.findSuggestion(req.user, query.search);
  }

  @Delete(':id')
  public async deleteMeal(@Request() req, @Param('id') id: string) {
    try {
      await this.mealService.remove(req.user, id);

      return { success: true };
    } catch {
      throw new HttpException(
        'Try again in a few minutes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
