import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const USER_TABLE_NAME = 'users';

@Entity({ name: USER_TABLE_NAME })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;
}
