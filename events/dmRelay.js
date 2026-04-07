const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {

  client.on("messageCreate", async (message) => {

    // Ignore bots
    if (message.author.bot) return;

    // Only DMs
    if (message.guild) return;

    // Fetch partial channel if needed
    if (message.channel.partial) {
      try {
        await message.channel.fetch();
      } catch (err) {
        console.error("Failed to fetch partial DM channel:", err);
        return;
      }
    }

    // Fetch the log channel
    const logChannel = await client.channels.fetch(process.env.DM_LOG_CHANNEL).catch(() => null);
    if (!logChannel) return;

    // Sanitize mentions in the content
    const content = (message.content || "No text").replace(/@/g, "?");

    // Attachments (if any)
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

    // Send to the support log channel
    logChannel.send({ embeds: [embed] });

  });

};
