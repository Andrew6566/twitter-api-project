import { Controller, Get, Query, Param } from '@nestjs/common';
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

  @Get('userId')
  async getUserId() {
    return this.twitterService.getUserId();
  }

  @Get('user-timeline/:userId')
  async getUserTimeline(@Param('userId') userId: string) {
    return this.twitterService.getUserTimeline();
  }

  @Get('dm-events')
  async getDmEvents() {
    return this.twitterService.getAllDmEvents();
  }
}
