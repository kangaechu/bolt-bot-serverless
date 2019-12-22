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

// ------------------------
// AWS Lambda handler
// ------------------------
const awsServerlessExpress = require('aws-serverless-express');
const server = awsServerlessExpress.createServer(expressReceiver.app);
module.exports.app = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
}