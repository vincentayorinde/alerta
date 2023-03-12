# Alerta Slack Service
> This app acts as a microserive to post messages on slack channels

## how to test
 > Setup keys <br>
- Set your slack token and secret key in .env KEY

## Set Headers
> ```secretKey: secret xxx```

##  How to run
> `npm i` <br>
`npm start`

## How run
> Access `/post_message`  <br>
payload ``` {
    "channel_name": "channel-for-notifications",
    "channel_webhook": "SAMPLEB0M2K76K/VgAaHzV5YYat2IWEBHOOK",
    "message": "testing message" 
} ```

## Tools
- Express
- Slack API


## Author
> [Vincent Ayorinde](https://github.com/vincentayorinde)
