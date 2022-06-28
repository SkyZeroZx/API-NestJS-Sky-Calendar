import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { MinLength, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { TaskToUser } from 'src/task_to_user/entities/task_to_user.entity';
import { Notificacion } from 'src/notificacion/entities/notificacion.entity';
 
@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  @OneToMany(() => TaskToUser, (TaskToUser) => TaskToUser.codUser, {
    nullable: false,
  })
  @JoinColumn()
  @OneToMany(() => Notificacion, (Notificacion) => Notificacion.id, {
    nullable: false,
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  @Column('varchar', { length: 80 })
  @MinLength(2)
  @MaxLength(80)
  @IsNotEmpty()
  nombre: string;

  @Column('varchar', { length: 120 })
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  apellidoPaterno: string;

  @Column('varchar', { length: 120 })
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  apellidoMaterno: string;

  @Column('varchar', { length: 35, default: 'CREADO' })
  estado: string;

  @Column('boolean', { default: true })
  firstLogin: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) {
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
}
