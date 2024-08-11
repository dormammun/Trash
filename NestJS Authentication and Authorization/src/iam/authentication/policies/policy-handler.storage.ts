import {Injectable, type Type} from "@nestjs/common";
import type {Policy} from "./policy.interface";
import type {PolicyHandler} from "./plicy-handler.interface";

@Injectable()
export class PolicyHandlerStorage {
  // Type → value should be function constructor/class → fn.constructor
  private readonly collection = new Map<Type<Policy>, PolicyHandler<any>>()

  add<T extends Policy>(policyCls: Type<T>, handler: PolicyHandler<T>){
    this.collection.set(policyCls, handler);
  }

  get<T extends Policy>(policyCls: Type<T>): PolicyHandler<T> | undefined {
    const handler = this.collection.get(policyCls);
    if (!handler) {
      throw new Error(`Unable to find policy for ${policyCls}`);
    }
    return handler
  }
}