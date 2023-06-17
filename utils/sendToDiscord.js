import axios from 'axios';
import dotenv from 'dotenv';
import Discord from 'discord.js'

const discordWebhookURL = 'https://discord.com/api/webhooks/1119581355299315732/EiV2M1q-wfNNY85EtvBGhcOXinK7dWiknXyAErYWTtYnofa7u8kC-3Fn3rd4a_6de7m5'

dotenv.config();

export const sendToDiscord = async (webhook, message, res) => {
  if (!webhook) return handleRes(res, 404, 'Discord webhook does not exist!', false);

  await axios.post(webhook, { content: message });
  return handleRes(res, 200, `Message post on Discord successfully!`, true);
};

const handleRes = (res, code, message, success) => {
  if (res) return res.status(code).send({ success, message });
};

