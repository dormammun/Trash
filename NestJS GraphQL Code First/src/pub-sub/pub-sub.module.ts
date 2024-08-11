import { Module } from "@nestjs/common"
import { PubSub } from "graphql-subscriptions"

@Module({
  exports: [PubSub],
  providers: [PubSub],
})
export class PubSubModule {}
