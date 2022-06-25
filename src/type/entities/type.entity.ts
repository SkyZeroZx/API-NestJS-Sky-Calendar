import { IsNotEmpty } from 'class-validator';
import { Task } from 'src/task/entities/task.entity';
import { Column, Entity,  OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Task,(Task) => Task.codType)
  codType: number;
 
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsNotEmpty()
  typeDescription: string;

  @Column({ type: 'varchar', length: 120 })
  @IsNotEmpty()
  backgroundColor: Date;

  @Column({ type: 'varchar', length: 12 })
  @IsNotEmpty()
  borderColor: Date;


  @Column({ type: 'time' })
  @IsNotEmpty()
  start: Date;

  @Column({ type: 'time' })
  @IsNotEmpty()
  end: Date;

  @Column({ type: 'varchar', length: 30 , default: 'BLOCK' })
  display: string;

}
