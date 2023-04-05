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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { MealService } from '@meal/service/meal.service';
import { AuthGuard } from '@auth/service/auth.guard';
import { CreateMealDto } from '@meal/interface/meal.create.dto';
import { MealDto } from '@meal/interface/meal.dto';
import { betweenDateRequest } from '@meal/interface/meal.interface';
import { UpdateMealDto } from '@meal/interface/meal.update.dto';

@Controller('meal')
@ApiTags('Meal')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @ApiOperation({ summary: 'Create meal' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: MealDto,
  })
  @ApiBadRequestResponse({ description: 'Error to create record' })
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
  @ApiQuery({
    name: 'begin',
    required: true,
    type: String,
    description: 'Begin date to get (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    type: String,
    description: 'End date to get (YYYY-MM-DD)',
  })
  @ApiOperation({ summary: 'Get meals between date' })
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
  @ApiOperation({ summary: 'Update meal' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: MealDto,
  })
  @ApiBadRequestResponse({ description: 'Error to update record' })
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
  @ApiQuery({
    name: 'search',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: 'Get menu suggestion from previous menus' })
  public async getMenuSuggestion(
    @Request() req,
    @Query() query: { search: string },
  ): Promise<string[]> {
    return this.mealService.findSuggestion(req.user, query.search);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove meal' })
  @ApiBadRequestResponse({ description: 'Error to remove record' })
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
