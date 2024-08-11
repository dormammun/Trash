import type { UserEntity } from "../../../users/entities/user.entity"

import type { Policy } from "./policy.interface"

export interface PolicyHandler<T extends Policy> {
  handler(policy: T, user: UserEntity): Promise<void>
}
