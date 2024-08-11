import type {Policy} from "./policy.interface";
import type {UserEntity} from "../../../users/entities/user.entity";

export interface PolicyHandler<T extends Policy> {
  handler(policy: T, user: UserEntity): Promise<void>;
}