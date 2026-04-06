const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
data: new SlashCommandBuilder()
.setName("dm")
.setDescription("Send a DM to a user (Support Only)")
.addStringOption(option =>
    option.setName("userid")
    .setDescription("User ID to DM")
    .setRequired(true)
)
.addStringOption(option =>
    option.setName("message")
    .setDescription("Message to send")
    .setRequired(true)
)
.addBooleanOption(option =>
    option.setName("embed")
    .setDescription("Send as embed")
    .setRequired(false)
),

async execute(interaction){

  
if(!interaction.member.roles.cache.has(process.env.SUPPORT_ROLE)){
return interaction.reply({
content: "❌ You need the Support role to use this command.",
ephemeral: true
});
}

const userId = interaction.options.getString("userid");
const message = interaction.options.getString("message");
const useEmbed = interaction.options.getBoolean("embed");

try{

const user = await interaction.client.users.fetch(userId);

if(useEmbed){

const embed = new EmbedBuilder()
.setColor("#00AEEF")
.setDescription(message)
.setFooter({ text: "XCloud Support" });

await user.send({ embeds: [embed] });

}else{

await user.send(message);

}

await interaction.reply({
content: `✅ DM sent to ${user.tag}`,
ephemeral: true
});

}catch(err){

console.error(err);

await interaction.reply({
content: "❌ Failed to send DM. User may have DMs disabled or invalid ID.",
ephemeral: true
});

}

}
};
