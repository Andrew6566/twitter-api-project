import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterService } from './twitter.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TwitterService],
})
export class AppModule {}
