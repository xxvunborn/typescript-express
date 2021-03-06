import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  public id: number | undefined;

  @Column()
  public name: string = '';

  @Column()
  public isComplete: boolean = false
}

export default Todo;

