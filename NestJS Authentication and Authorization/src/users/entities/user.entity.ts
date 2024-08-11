import {Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {RoleEnum} from "../enums/role.enum";
import {PermissionType} from "../../iam/authentication/permission.type";
import {ApiKeyEntity} from "../api-keys/entities/api-key.entity/api-key.entity";

@Entity({name: 'users'})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @Column({enum: RoleEnum, default: RoleEnum.Regular})
  role: RoleEnum

  @Column({type: 'json', nullable: true})
  permissions: PermissionType[]

  @JoinTable()
  @OneToMany(type => ApiKeyEntity, (apiKey) => apiKey.user)
  apiKeys: ApiKeyEntity[]
}
