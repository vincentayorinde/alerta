import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkMXRecord } from "./utils/mxLookup.js";
import { sendToSlack, handleRedirect} from "./utils/sendToSlack.js";
import { sendToTelegram } from "./utils/sendToTelegram.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/check-mx-record", (req, res) => {
  const { secretkey } = req.headers;
  const { email } = req.body;
  if (secretkey === `secret ${process.env.KEY}`) {
    if (email) {
      checkMXRecord(email, res);
    } else {
      res.status(400).send({
        success: false,
        message: "email is required",
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: "Unauthrized Access",
    });
  }
});

app.post("/post_message", (req, res) => {
  const { secretkey } = req.headers;
  const { channel_name, channel_webhook, message } = req.body;
  if (secretkey === `secret ${process.env.KEY}`) {
    if (channel_name && channel_webhook && message) {
      sendToSlack(channel_name, channel_webhook, message, res);
      sendToTelegram(channel_name, message, res);
    } else {
      res.status(400).send({
        success: false,
        message: "channel name, webhook and message are required!",
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: "Unauthrized Access",
    });
  }
});

app.get("/", (req, res) => {
  res.send({ message: "Welcome to alerta service" });
});

app.get("/oauth", (req, res) => {
    handleRedirect('https://slack.com/api/oauth.access', req.query)
  });


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
