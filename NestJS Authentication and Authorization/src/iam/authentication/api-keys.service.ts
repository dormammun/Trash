import { randomUUID } from "node:crypto"

import { Injectable } from "@nestjs/common"

import { HashingService } from "../hashing/hashing.service"

export interface GeneratedApiKeyPayload {
  apiKey: string
  hashedKey: string
}

@Injectable()
export class ApiKeysService {
  constructor(private readonly hashService: HashingService) {}
  private generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`
    return Buffer.from(apiKey, "base64").toString("base64")
  }

  async createAndHash(id: number): Promise<GeneratedApiKeyPayload> {
    const apiKey = this.generateApiKey(id)
    const hashedKey = await this.hashService.hash(apiKey)
    return { apiKey, hashedKey }
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, "base64").toString("ascii").split(" ")
    return id
  }

  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return await this.hashService.compare(apiKey, hashedKey)
  }
}
