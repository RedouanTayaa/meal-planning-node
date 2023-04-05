import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealEntity } from '@meal/entity/meal.entity';
import { MealService } from '@meal/service/meal.service';
import { MealController } from '@meal/controller/meal.controller';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity]), UserModule, AuthModule],
  providers: [MealService],
  controllers: [MealController],
})
export class MealModule {}
