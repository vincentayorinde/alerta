import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendToDiscord = async (webhook, message, res) => {
  if (!webhook) return handleRes(res, 404, 'Discord webhook does not exist!', false);

  await axios.post(webhook, { content: message });
  return handleRes(res, 200, `Message post on Discord successfully!`, true);
};

const handleRes = (res, code, message, success) => {
  if (res) return res.status(code).send({ success, message });
};

