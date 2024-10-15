import { Injectable } from '@nestjs/common';
import { TwitterApi, ETwitterStreamEvent, TweetStream } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { Cron, CronExpression } from '@nestjs/schedule';

dotenv.config();

@Injectable()
export class TwitterService {
  private twitterClient: TwitterApi;
  private stream: TweetStream;

  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    // this.twitterClient = new TwitterApi({
    //   clientId: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    // });
  }

  // async onModuleInit() {
  //   await this.startUserStream();
  // }

  // onModuleDestroy() {
  //   this.stopUserStream();
  // }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async scheduledGetUserId() {
    console.log('Running scheduled getUserId');
    await this.getUserId();
  }

  async getTweets() {
    try {
      const { data: createdTweet } = await this.twitterClient.v2.tweet(
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
      const user = await this.twitterClient.v2.userByUsername('SontranAms');
      console.log('Your User:', user);
    } catch (error) {
      console.error('Error fetching user ID:', error);
      throw error;
    }
  }

  async getUserTimeline(userId: string) {
    try {
      // const userTimeline = await this.twitterClient.v2.userTimeline(
      //   '1845732258671689728',
      //   {
      //     expansions: [
      //       'attachments.media_keys',
      //       'attachments.poll_ids',
      //       'referenced_tweets.id',
      //     ],
      //     'media.fields': ['url'],
      //   },
      // );

      // const tweets = [];

      // for await (const tweet of userTimeline) {
      //   console.log(
      //     '🚀 SonTT25 ~ file: twitter.service.ts:70 ~ TwitterService ~ forawait ~ tweet:',
      //     tweet,
      //   );

      //   const medias = userTimeline.includes.medias(tweet);
      //   const poll = userTimeline.includes.poll(tweet);

      //   const tweetInfo = {
      //     id: tweet.id,
      //     text: tweet.text,
      //     medias: medias.length ? medias.map((m) => m.url) : [],
      //     poll: poll ? poll.options.map((opt) => opt.label) : null,
      //   };

      //   tweets.push(tweetInfo);
      // }

      // return tweets;

      // Home timeline is available in v1 API, so use .v1 prefix
      const homeTimeline = await this.twitterClient.v1.homeTimeline();

      console.log(
        '🚀 SonTT25 ~ file: twitter.service.ts:99 ~ TwitterService ~ getUserTimeline ~ homeTimeline:',
        homeTimeline,
      );
    } catch (error) {
      console.error('Error fetching user timeline:', error);
      throw error;
    }
  }

  async startUserStream() {
    try {
      this.stream = await this.twitterClient.v1.filterStream({
        follow: [process.env.YOUR_USER_ID], // Replace with your Twitter user ID
      });

      const stream = await this.twitterClient.v1.sampleStream();

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
