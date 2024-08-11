import { Injectable } from "@nestjs/common"

@Injectable()
export abstract class HashingService {
  abstract compare(source: Buffer | string, encoding: string): Promise<boolean>
  abstract hash(source: Buffer | string): Promise<string>
}
