import sendEmail from './sendMail';
export const ReplaceData = (content, object) => content.replace(
    new RegExp(
        // Convert the object to array of keys
        Object.keys(object)
            // Escape any special characters in the search key
            .map((key) => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
            // Create the Regex pattern
            .join('|'),
        // Additional flags can be used. Like i - case-insensitive search
        'g'
    ),
    // For each key found, replace with the appropriate value
    (match) => object[match]
);


export const sendOtpEmail = async (email, template, Emailreplacedobject) => {
    // console.log('email >>>>>', email)
    try {
        let ReplacedContent = template
            ? ReplaceData(template?.emailTemplate, Emailreplacedobject)
            : '';
        const emailResponse = await sendEmail(
            email,
            ReplacedContent,
            template.subject,
        );
        // console.log('emailResponse', emailResponse)
        return emailResponse;
    } catch { }
}