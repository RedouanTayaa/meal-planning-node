import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { MealEntity } from '../../../modules/meal/entity/meal.entity';

const bcrypt = require('bcrypt');

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  public username: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  public password: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  public email: string;
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => MealEntity, (meal) => meal.owner)
  public meals: MealEntity[];
}
