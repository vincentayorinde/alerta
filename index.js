import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkMXRecord } from './utils/mxLookup.js';
import { sendToSlack } from './utils/sendToSlack.js';
import { sendToTelegram } from './utils/sendToTelegram.js';
import { WebClient } from '@slack/web-api';
import { add, read } from './utils/firebase.js';

const client = new WebClient();
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/check-mx-record', (req, res) => {
  const { secretkey } = req.headers;
  const { email } = req.body;
  if (secretkey === `secret ${process.env.KEY}`) {
    if (email) {
      checkMXRecord(email, res);
    } else {
      res.status(400).send({
        success: false,
        message: 'email is required',
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: 'Unauthrized Access',
    });
  }
});

app.post('/post_message', (req, res) => {
  const { secretkey } = req.headers;
  const { channel_name, message } = req.body;
  if (secretkey === `secret ${process.env.KEY}`) {
    const checkChannel = read(channel_name);
    if (channel_name && message && checkChannel) {
      sendToSlack(channel_name, checkChannel.url, message, res);
      //   sendToTelegram(channel_name, message, res);
    } else {
      res.status(400).send({
        success: false,
        message: 'channel name, webhook and message are required!',
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: 'Unauthrized Access',
    });
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to alerta service' });
});

app.get('/auth/slack', async (_, res) => {
  const checkChannel = await read('#skalebar-cohorts');
  console.log('the log>>>>', checkChannel);
  const scopes = 'identity.basic,identity.email';
  const bot_scope = 'incoming-webhook';
  const redirect_url = `${process.env.host}/auth/slack/callback`;

  const url = `https://slack.com/oauth/v2/authorize?client_id=${process.env.client_id}&user_scopes=${scopes}&scope=${bot_scope}&redirect_uri=${redirect_url}`;

  res.status(200).header('Content-Type', 'text/html; charset=utf-8').send(`
            <html><body>
            <a href="${url}"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
            </body></html>
        `);
});

app.get('/auth/slack/callback', async (req, res) => {
  try {
    const response = await client.oauth.v2.access({
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      code: req.query.code,
    });

    const identity = await client.users.identity({
      token: response.authed_user.access_token,
    });

    res
      .status(200)
      .send(
        `<html><body><p>You have successfully logged integrated Alerta to the slack channel! with your slack account! Here are the details:</p><p>Response: ${JSON.stringify(
          response,
        )}</p><p>Identity: ${JSON.stringify(identity)}</p></body></html>`,
      );
    add({ hook: response.incoming_webhook, identity });
  } catch (err) {
    console.log(err);
    res.status(500).send(`<html><body><p>Something went wrong!</p><p>${JSON.stringify(err)}</p>`);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
