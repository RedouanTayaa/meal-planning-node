import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from '@config/config.service';
import { UserModule } from '@user/user.module';
import { MealModule } from '@meal/meal.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    UserModule,
    MealModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
