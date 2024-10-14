import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { TwitterService } from './twitter.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly twitterService: TwitterService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tweets')
  async getTweets() {
    return this.twitterService.getTweets();
  }
}
