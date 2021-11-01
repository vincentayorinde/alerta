const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const SlackBot = require('slackbots')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.post('/post-message', (req, res) => {
	const { secretkey } = req.headers
	const { channel, message } = req.body
	if (secretkey === `secret ${process.env.KEY}`) {
		if (channel && message) {
			sendToSlack(channel, message, res)
		} else {
			res.status(400).send({
				success: false,
				message: 'channel and message are required',
			})
		}
	} else {
		res.status(401).send({
			success: false,
			message: 'Unauthrized Access',
		})
	}
})

app.get('/', (req, res) => {
	res.send({ message: 'Bitnob slack service' })
})

const port = 5000 || process.env.PORT
app.listen(port, () => console.log(`Listening on port ${port}`))

/*
 Send to send message to slack channel
*/
function sendToSlack(channel, message, res) {
    const bot = new SlackBot({
        token: process.env.SLACK_TOKEN,
        name: 'alerta',
    })
    bot.on('start', () => {
        bot
            .postMessageToChannel(channel, message)
            .then((repoonse) => {
                res.send(repoonse)
            })
            .catch((error) => {
                console.error(error)
            })
    })
    res.status(200).send({
        success: true,
        message: `Message post on ${channel} successfully!`,
    })
}

