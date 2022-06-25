import { Notificacion } from 'src/notificacion/entities/notificacion.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
 

@Entity()
export class TaskToUser {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Notificacion, (Notificacion) => Notificacion.id, {
    nullable: false,
  })
  id: number;

  @ManyToOne(() => User, (User) => User.id, {
    nullable: false,
    onDelete :"CASCADE"
  })
  @JoinColumn({ name: "codUser" })
  codUser: number;

  @ManyToOne(() => Task, (Task) => Task.codTask, {
    nullable: false,
    onDelete :"CASCADE"
  })
  @JoinColumn({ name: "codTask" })
  codTask: number;
}