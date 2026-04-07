const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {

  client.on("messageCreate", async (message) => {


    if (message.author.bot) return;


    if (message.guild) return;


    if (message.channel.partial) {
      try {
        await message.channel.fetch();
      } catch (err) {
        console.error("Failed to fetch partial DM channel:", err);
        return;
      }
    }


    const logChannel = await client.channels.fetch(process.env.DM_LOG_CHANNEL).catch(() => null);
    if (!logChannel) return;


    const content = (message.content || "No text").replace(/@/g, "?");


    const attachments = message.attachments.size
      ? message.attachments.map(a => a.url).join("\n")
      : "None";

    const embed = new EmbedBuilder()
      .setColor("#00AEEF")
      .setTitle("📩 New DM Received")
      .addFields(
        { name: "User", value: `${message.author.tag} (${message.author.id})` },
        { name: "Message", value: content },
        { name: "Attachments", value: attachments }
      )
      .setTimestamp();


    logChannel.send({ embeds: [embed] });

  });

};
