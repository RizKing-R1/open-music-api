import nodemailer from "nodemailer";
import config from "../../utils/config.js";

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.address,
        pass: config.mail.password,
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
