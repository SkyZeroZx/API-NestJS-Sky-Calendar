import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
  import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  @IsNotEmpty()
  tokenPush: string;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete :"CASCADE"
  })
  @JoinColumn({ name: 'codUser' })
  @Column()
  codUser: number;
}
