import fetch from 'node-fetch'

/*
 Send to send message to telegram
*/
export const sendToTelegram = (channel, message, res) => {
	const url = `${process.env.TELEGRAM_API}${process.env.TELEGRAM_AUTH_TOKEN}/sendMessage?chat_id=@${process.env.TELEGRAM_GROUP_ID}&text=CHANNEL: ${channel} CONTENT: ${message}`
	const url_fin = `${process.env.TELEGRAM_API}${process.env.TELEGRAM_AUTH_TOKEN_F}/sendMessage?chat_id=@${process.env.TELEGRAM_GROUP_ID_F}&text=CHANNEL: ${channel} CONTENT: ${message}`
	if (
		channel === 'channel' ||
		message.includes('agent account')
	) {
		fetch(url_fin)
			.then((response) => response.json())
			.then((data) => console.log())
			.catch((error) => {
				console.error(error)
			})
		return
	}
	fetch(url)
		.then((response) => response.json())
		.then((data) => console.log())
		.catch((error) => {
			console.error(error)
		})
}
