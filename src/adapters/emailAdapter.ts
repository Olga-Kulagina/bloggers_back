import nodemailer from "nodemailer";

export const emailAdapter = {
    async emailSend(email: string, subject: string, message: string) {

        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "kulagina24601@gmail.com",
                pass: "gunwhdgnfbalmdwz",
            }
        })

        let info = await transport.sendMail(
            {
                from: '"Olga" <kulagina24601@gmail.com>',
                to: email,
                subject: subject,
                text: message,
            }
        )
        return info
    }
}