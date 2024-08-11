import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { UserEntity } from "../../../entities/user.entity"

@Entity({ name: "apiKeys" })
export class ApiKeyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  key: string

  @ManyToOne((type) => UserEntity, (user) => user.apiKeys)
  user: UserEntity

  @Column()
  uuid: string
}
