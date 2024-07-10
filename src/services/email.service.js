const emailTemplate = require('../models/emailTemplate.model')


const fetchEmailTemplate = async (emailType) => {
    try {
        const fetchTemplate = await emailTemplate.findOne({ emailType });
        if (!fetchTemplate) {
            return res.status(200).send({
                status: 'No Email Template',
                data: [],
            });
        }
        return fetchTemplate;

    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { fetchEmailTemplate }