'use strict';

// ------------------------
// Bolt App Initialization
// ------------------------
const { App, ExpressReceiver } = require('@slack/bolt');
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver
});

// ------------------------
// Application Logic
// ------------------------

app.message('ping', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say(`pong`)
});

app.event('team_join', async ({ event, context }) => {
  const teamJoinNotifyChannel = process.env.TEAM_JOIN_NOTIFY_CHANNEL || '#general';
  try {
    //send welcome message
    const welcomeMessage = await app.client.chat.postMessage({
      token: context.botToken,
      channel: teamJoinNotifyChannel,
      text: `ようこそ <@${event.user.id}>! 🎉 自己紹介をしてみましょう！`
    });
    console.log(welcomeMessage);

    // get channel name of this month (yyyy-mm)
    const today = new Date();
    const thisYM = today.getFullYear() + '- ' + ("0" + (today.getMonth() + 1)).slice(-2);
    // send links
    const linkMessage = await app.client.chat.postMessage({
      token: context.botToken,
      channel: teamJoinNotifyChannel,
      thread_ts: welcomeMessage.ts,
      link_names: true,
      text: "これらのチャンネルに参加してみるといいよ！"
        + "- #technical: 技術的な話\n"
        + "- #news : IT関連のニュース\n"
        + "- #random : なんでも\n"
        + `- #${thisYM} : 今月のMeetUp\n`
        + "- times_username : 分報\n"
        + "自分のチャンネルも作ってみよう！"
    });
    console.log(linkMessage);
  }
  catch (error) {
    console.error(error);
  }
});

app.event('channel_created', async ({ event, context }) => {
  const channelCreatedNotifyChannel = process.env.CHANNEL_CREATED_NOTIFY_CHANNEL || '#general';
  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: channelCreatedNotifyChannel,
      text: `#${event.channel.name} チャンネルが作られたよ!🎉`,
      link_names: true
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});
// ------------------------
// AWS Lambda handler
// ------------------------
const awsServerlessExpress = require('aws-serverless-express');
const server = awsServerlessExpress.createServer(expressReceiver.app);
module.exports.app = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
}