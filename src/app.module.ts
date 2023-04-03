import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MealModule } from './meal/meal.module';

@Module({
  imports: [UserModule, MealModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
