import dns from 'dns'

export const checkMXRecord = (email, res) => {
    const domain = email.split('@')[1];
    dns.resolve(domain, 'MX', function (err, addresses) {
        if (err) {
            res.status(400).send({
				success: false,
				message: 'No MX record for this email',
			})
        } else if (addresses && addresses.length > 0) {
            res.status(200).send({
                success: true,
                message: `This MX records for ${domain} exists so email as valid`,
            })
        }
    })
}


