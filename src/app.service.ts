import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): string {
    return process.env.SERVER_NAME;
  }
}
