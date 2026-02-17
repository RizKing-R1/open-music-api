import "dotenv/config";
import amqplib from "amqplib";
import PlaylistsService from "./services/postgres/PlaylistsService.js";
import MailSender from "./services/mail/MailSender.js";
import config from "./utils/config.js";

const playlistsService = new PlaylistsService();
const mailSender = new MailSender();

const init = async () => {
  const connection = await amqplib.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlists", { durable: true });

  console.log("Consumer sedang mendengarkan queue export:playlists...");

  channel.consume("export:playlists", async (msg) => {
    try {
      const { playlistId, targetEmail } = JSON.parse(msg.content.toString());

      const playlist = await playlistsService.getPlaylistSongs(playlistId);

      const result = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: playlist.songs,
        },
      };

      await mailSender.sendEmail(targetEmail, result);

      console.log(`Email berhasil dikirim ke ${targetEmail}`);
      channel.ack(msg);
    } catch (error) {
      console.error("Gagal memproses pesan:", error.message);
      channel.ack(msg);
    }
  });
};

init().catch(console.error);
