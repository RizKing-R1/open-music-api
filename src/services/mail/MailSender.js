import nodemailer from "nodemailer";

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: "OpenMusic API <openmusic@app.com>",
      to: targetEmail,
      subject: "Ekspor Playlist",
      text: "Terlampir hasil ekspor playlist Anda",
      attachments: [
        {
          filename: "playlist.json",
          content: JSON.stringify(content, null, 2),
          contentType: "application/json",
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

export default MailSender;
