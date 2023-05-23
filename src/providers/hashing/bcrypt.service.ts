import { Injectable } from "@nestjs/common";
import { HashingService } from "./hashing.service";
import { compare, genSalt, hash } from "bcrypt";

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    /** Podemos poner el numero de saltos que deseamos, podriamos utilizar 10 ciclos.
     * Aumentar el factor de trabajo puede hacer que el proceso de hash sea más lento pero también más seguro contra ataques de fuerza bruta.
     */
    const salt = await genSalt();

    return hash(data, salt);
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
