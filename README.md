# nankatsu-bot

nankatsu-bot is a Slack bot powered by [Slack's Bolt⚡️](https://slack.dev/bolt/).

## Installation

```bash

# 1) Slack App Configuration
# Go to https://api.slack.com/apps
#   - Create a Slash command named `/echo` (Request URL can be a dummy)
#   - Create a bot user @{bot-name}
#   - Install the app to your workspace

# 2) App Setup
npm i -g serverless
npm i
cp _env .env
vi .env # set SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN
source .env

# 3) Local Development
sls offline # local dev
ngrok http 3000 # on another terminal window

# Update the Request URL for the slash command with the ngrok URL

# 4) Make sure it works on Slack
#  /invite @{bot-name}
#  /echo something

# 5) Deploy to AWS
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=yyy
sls deploy

# Update the Request URL for the slash command with the AWS URL
```