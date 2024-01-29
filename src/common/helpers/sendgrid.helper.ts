import * as SendGrid from '@sendgrid/mail';
SendGrid.setApiKey(process.env.SERVISE_EMAIL_SENDGRID_APIKEY);

export async function sendMail(mail: SendGrid.MailDataRequired) {
    const sendGridResult = await SendGrid.send(mail);

    return sendGridResult;
}

export async function sendPasswordRecoveryEmail(to: string, code: string): Promise<boolean> {
    const mail = {
        to: to,
        subject: 'iMoon password recovery code',
        from: `no-reply@${process.env.DOMAIN}`,
        text: code,
        html: `<a href="${process.env.PASSWORD_RECOVERY_CALLBACK_URL}?code=${code}">Recover Password</a>`
    };

    const sendGridResult = await sendMail(mail);

    return sendGridResult?.length && (sendGridResult[0].statusCode === 202)
}