const bcrypt = require('bcrypt');

import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
