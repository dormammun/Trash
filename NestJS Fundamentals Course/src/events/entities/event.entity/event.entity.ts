import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'events'})
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string

  @Index()
  @Column()
  name: string

  @Column({type: "json"})
  payload: Record<string, any>
}
