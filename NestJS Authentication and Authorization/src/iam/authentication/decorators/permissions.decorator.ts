import {SetMetadata} from "@nestjs/common";
import type {PermissionType} from "../permission.type";

export const Permissions = (...permissions: PermissionType[]) => SetMetadata('permissions', permissions);