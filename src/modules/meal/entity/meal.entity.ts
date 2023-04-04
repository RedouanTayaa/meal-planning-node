import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { MealType } from '../interface/meal.interface';
import { UserEntity } from '../../../modules/user/entity/user.entity';

@Entity('meal')
@Index(['date', 'type', 'owner'], { unique: true })
export class MealEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({
    type: 'date',
    nullable: false,
  })
  public date: Date;

  @Column({
    type: 'enum',
    enum: MealType,
    nullable: false,
  })
  public type: MealType;

  @Column({
    type: 'text',
    nullable: false,
  })
  public menu: string;

  @ManyToOne(() => UserEntity, (user) => user.meals, { nullable: false })
  owner: UserEntity;
}
