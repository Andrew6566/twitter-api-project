import { Injectable } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TwitterService {
  private twitterClient: TwitterApi;

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
}
