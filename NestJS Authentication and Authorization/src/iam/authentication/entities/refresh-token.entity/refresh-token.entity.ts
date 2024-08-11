import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'refreshTokens'})
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  token: string

  @Column()
  userId: number
}
