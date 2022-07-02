import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
 

@Entity()
export class TaskToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete :"CASCADE"
  })
  @JoinColumn({ name: "codUser" })
  codUser: number;

  @ManyToOne(() => Task, (task) => task.codTask, {
    nullable: false,
    onDelete :"CASCADE"
  })
  @JoinColumn({ name: "codTask" })
  codTask: number;
}
