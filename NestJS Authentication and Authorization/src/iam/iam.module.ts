import {Module} from '@nestjs/common';
import {HashingService} from './hashing/hashing.service';
import {BcryptService} from './bcrypt/bcrypt.service';
import {AuthenticationController} from './authentication/authentication.controller';
import {AuthenticationService} from './authentication/authentication.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../users/entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import {jwtConfigNC} from "./config/jwt.config";
import {JwtModule} from '@nestjs/jwt';
import {APP_GUARD} from "@nestjs/core";
import {AuthenticationGuard} from "./authentication/guard/authentication/authentication.guard";
import {AccessTokenGuard} from "./authentication/guards/access-token/access-token.guard";
import {RefreshTokenIdsStorage} from "./authentication/refresh-token-ids.storage/refresh-token-ids.storage";
import {RefreshTokenEntity} from "./authentication/entities/refresh-token.entity/refresh-token.entity";
import {RolesGuard} from "./authorization/decorators/guards/roles/roles.guard";
import {PermissionsGuard} from "./authorization/decorators/guards/permissions.guard";
import {PolicyHandlerStorage} from "./authentication/policies/policy-handler.storage";
import {FrameworkContributerPolicyHandler} from "./authentication/policies/framework-contributer.policy";
import {PoliciesGuard} from "./authentication/policies/policies.guard";
import { ApiKeysService } from './authentication/api-keys.service';
import {ApiKeyGuard} from "./authentication/guards/api-key/api-key.guard";
import {ApiKeyEntity} from "../users/api-keys/entities/api-key.entity/api-key.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity, ApiKeyEntity]), ConfigModule.forFeature(jwtConfigNC),
  JwtModule.registerAsync(jwtConfigNC.asProvider())
  ],
  providers: [{provide: HashingService, useClass: BcryptService}, AuthenticationService, AccessTokenGuard, {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
  }, RefreshTokenIdsStorage, {
    provide: APP_GUARD,
    useClass: RolesGuard
  }, {
    provide: APP_GUARD,
    useClass: PermissionsGuard
  }, {
    provide: APP_GUARD,
    useClass: PoliciesGuard}, PolicyHandlerStorage, FrameworkContributerPolicyHandler, ApiKeysService,
      ApiKeyGuard
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
