import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"

import { HashingService } from "../hashing/hashing.service"

@Injectable()
export class BcryptService implements HashingService {
  compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return bcrypt.hash(password, salt)
  }
}
