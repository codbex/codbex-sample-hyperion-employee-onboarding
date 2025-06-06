import { configurations } from "sdk/core";
import { logging } from "sdk/log";
import { client as mailClient } from "sdk/mail";

const logger = logging.getLogger("mail-util.ts");

function isMailConfigured() {
    return configurations.get("DIRIGIBLE_MAIL_USERNAME") &&
        configurations.get("DIRIGIBLE_MAIL_PASSWORD") &&
        configurations.get("DIRIGIBLE_MAIL_TRANSPORT_PROTOCOL") &&
        (
            (configurations.get("DIRIGIBLE_MAIL_SMTPS_HOST") && configurations.get("DIRIGIBLE_MAIL_SMTPS_PORT") && configurations.get("DIRIGIBLE_MAIL_SMTPS_AUTH"))
            ||
            (configurations.get("DIRIGIBLE_MAIL_SMTP_HOST") && configurations.get("DIRIGIBLE_MAIL_SMTP_PORT") && configurations.get("DIRIGIBLE_MAIL_SMTP_AUTH"))
        );
}

export function sendMail(reciever: string, subject: string, content: string) {
    const sender = configurations.get("ONBOARDING_EMAIL");

    if (isMailConfigured()) {
        logger.info("Sending mail to [{}] with subject [{}] and content: [{}]...", reciever, subject, content);
        mailClient.send(sender, reciever, subject, content, 'html');
    } else {
        logger.error(`Mail to: ${reciever} with subject: ${subject} and content: ${content} will NOT be send because the mail client is not configured!`);
        throw new Error(`Mail to: ${reciever} with subject: ${subject} and content: ${content} will NOT be send because the mail client is not configured!`);
    }

}