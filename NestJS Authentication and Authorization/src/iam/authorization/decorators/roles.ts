import { SetMetadata } from "@nestjs/common"

import type { RoleEnum } from "../../../users/enums/role.enum"

export const Roles = (...roles: RoleEnum[]) => SetMetadata("roles", roles)
