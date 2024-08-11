import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

import { PermissionType } from "../../iam/authentication/permission.type"
import { ApiKeyEntity } from "../api-keys/entities/api-key.entity/api-key.entity"
import { RoleEnum } from "../enums/role.enum"

@Entity({ name: "users" })
export class UserEntity {
  @JoinTable()
  @OneToMany((type) => ApiKeyEntity, (apiKey) => apiKey.user)
  apiKeys: ApiKeyEntity[]

  @Column()
  email: string

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  password: string

  @Column({ nullable: true, type: "json" })
  permissions: PermissionType[]

  @Column({ default: RoleEnum.Regular, enum: RoleEnum })
  role: RoleEnum
}
