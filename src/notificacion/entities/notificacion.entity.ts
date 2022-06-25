import { IsNotEmpty } from 'class-validator';
import { TaskToUser } from 'src/task_to_user/entities/task_to_user.entity';
 import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  @IsNotEmpty()
  tokenPush: string;

  @ManyToOne(() => TaskToUser, (TaskToUser) => TaskToUser.id, {
    nullable: false,
    onDelete :"CASCADE"
  })
  @JoinColumn({ name: 'codTaskToUser' })
  @Column()
  codTaskToUser: number;
}
