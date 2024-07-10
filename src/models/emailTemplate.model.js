const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    emailType: {
        type: String,
    },
    emailTemplate: {
        type: String,
    },
    subject: {
        type: String,
    },
    attachment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const emailTemplate = mongoose.model("email_templates", emailSchema);

module.exports = emailTemplate;