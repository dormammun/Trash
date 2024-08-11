import { SetMetadata } from "@nestjs/common"

import type { Policy } from "./policy.interface"

export const Policies = (...policies: Policy[]) =>
  SetMetadata("policies", policies)
