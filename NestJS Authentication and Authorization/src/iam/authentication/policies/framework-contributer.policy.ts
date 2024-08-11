import { Injectable } from "@nestjs/common"

import { UserEntity } from "../../../users/entities/user.entity"

import type { PolicyHandler } from "./plicy-handler.interface"
import { PolicyHandlerStorage } from "./policy-handler.storage"
import type { Policy } from "./policy.interface"

export class FrameworkContributerPolicy implements Policy {
  name = "FrameworkContributer"
}

@Injectable()
export class FrameworkContributerPolicyHandler
  implements PolicyHandler<FrameworkContributerPolicy>
{
  // @todo: think how cool it is
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(FrameworkContributerPolicy, this)
  }

  async handler(
    policy: FrameworkContributerPolicy,
    user: UserEntity
  ): Promise<void> {
    const isContributor = user.email.endsWith("@nestjs.com")
    if (!isContributor) {
      throw new Error("User is not a contributor")
    }
  }
}
