import type {Policy} from "./policy.interface";
import {SetMetadata} from "@nestjs/common";

export const Policies = (...policies: Policy[]) => SetMetadata('policies', policies);