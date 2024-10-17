import { Injectable } from '@nestjs/common';
import { TwitterApi, ETwitterStreamEvent, TweetStream } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { Cron, CronExpression } from '@nestjs/schedule';

dotenv.config();

@Injectable()
export class TwitterService {
  private client: TwitterApi;
  private stream: TweetStream;

  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    // this.client = new TwitterApi({
    //   clientId: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    // });

    // this.client = new TwitterApi(process.env.BEARER_TOKEN);
  }

  // async onModuleInit() {
  //   await this.startUserStream();
  // }

  // onModuleDestroy() {
  //   this.stopUserStream();
  // }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async scheduledGetUserId() {
  //   console.log('Running scheduled to get the user timeline');
  //   await this.getUserTimeline();
  // }

  async getTweets() {
    try {
      const { data: createdTweet } = await this.client.v2.tweet(
        'twitter-api-v2 is awesome!',
        {
          poll: { duration_minutes: 120, options: ['Absolutely', 'For sure!'] },
        },
      );
      console.log('Tweet', createdTweet.id, ':', createdTweet.text);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  }

  async getUserId() {
    try {
      const user = await this.client.v2.user(process.env.YOUR_USER_ID);
      console.log('Your User:', user);
    } catch (error) {
      console.error('Error fetching user ID:', error);
      throw error;
    }
  }

  async getAllDmEvents() {
    try {
      // const eventTimeline = await this.client.v2.listDmEvents()
      // console.log(eventTimeline)

      const eventTimeline = await this.client.v2.listDmEventsWithParticipant(
        process.env.YOUR_USER_ID,
      );
      console.log(eventTimeline);
    } catch (error) {
      console.error('Error fetching DM events:', error);
      throw error;
    }
  }

  async getUserTimeline() {
    try {
      const homeTimeline = await this.client.v2.userTimeline(
        process.env.YOUR_USER_ID,
      );

      console.log(
        '🚀 file: twitter.service.ts:83 ~ TwitterService ~ getUserTimeline ~ homeTimeline:',
        homeTimeline?.data?.data[0],
      );
    } catch (error) {
      console.error('Error fetching user timeline:', error);
      throw error;
    }
  }

  async startUserStream() {
    try {
      this.stream = await this.client.v1.filterStream({
        follow: [process.env.YOUR_USER_ID], // Replace with your Twitter user ID
      });

      const stream = await this.client.v1.sampleStream();

      this.stream.autoReconnect = true;

      stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        (eventData) => console.log('Twitter has sent something:', eventData),
      );

      stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        ETwitterStreamEvent.DataKeepAlive,
        () => console.log('Twitter has a keep-alive packet.'),
      );

      this.stream.on(ETwitterStreamEvent.ConnectionError, (err) => {
        console.log('Connection error!', err);
      });

      this.stream.on(ETwitterStreamEvent.ConnectionClosed, () => {
        console.log('Connection has been closed.');
      });

      this.stream.close();
      console.log('User stream stopped');

      // this.stream.on(ETwitterStreamEvent.Data, (tweet) => {
      //   if (tweet.in_reply_to_user_id_str === process.env.YOUR_USER_ID) {
      //     console.log('New post on your wall:', tweet.text);
      //     // Handle the new post here
      //   }
      // });

      stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        (eventData) => console.log('Twitter has sent something:', eventData),
      );

      stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        ETwitterStreamEvent.DataKeepAlive,
        () => console.log('Twitter has a keep-alive packet.'),
      );

      this.stream.on(ETwitterStreamEvent.ConnectionError, (err) => {
        console.log('Connection error!', err);
      });

      this.stream.on(ETwitterStreamEvent.ConnectionClosed, () => {
        console.log('Connection has been closed.');
      });

      console.log('User stream started successfully');
    } catch (error) {
      console.error('Error starting user stream:', error);
      throw error;
    }
  }

  stopUserStream() {
    if (this.stream) {
      this.stream.close();
      console.log('User stream stopped');
    }
  }
}
