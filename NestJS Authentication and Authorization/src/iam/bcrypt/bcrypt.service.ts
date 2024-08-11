import * as bcrypt from 'bcrypt';
import {HashingService} from "../hashing/hashing.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BcryptService implements HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
