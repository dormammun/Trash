import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(source: string | Buffer): Promise<string>
  abstract compare(source: string | Buffer, encoding: string): Promise<boolean>
}
