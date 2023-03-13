import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendToSlack = async (channel_name, url, message, res) => {
  if (!url) return handleRes(res, 404, 'Slack channel does not exist!', false);

  const blocks = [{ type: 'section', text: { type: 'mrkdwn', text: `${message}` } }];
  await axios.post(url, { blocks });
  return handleRes(res, 200, `Message post on ${channel_name} successfully!`, true);
};

const handleRes = (res, code, message, success) => {
  if (res) return res.status(code).send({ success, message });
};

