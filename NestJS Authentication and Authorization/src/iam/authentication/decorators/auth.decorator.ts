import {SetMetadata} from "@nestjs/common";
import {AuthTypeEnum} from "../enums/auth-type.enum";

export const AuthType = (...authType: AuthTypeEnum[]) => SetMetadata('authType', authType);