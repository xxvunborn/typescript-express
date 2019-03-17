import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class HelloWorld {
  @PrimaryGeneratedColumn()
  public id: number | undefined;

  @Column()
  public greeting: string | undefined;
}

export default HelloWorld;

