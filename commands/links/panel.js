const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("panel")
.setDescription("Create NRG link dispenser panel"),

async execute(interaction){

await interaction.deferReply({ephemeral:true});

const embed = new EmbedBuilder()
.setTitle("NRG Link Dispenser")
.setDescription(`
Weekly Limits
Normal Users: 1 link
NRG Premium / Booster: 3 links

Choose how you want to receive your link.
`);

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("link_dm")
.setLabel("Send in DM")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("link_reply")
.setLabel("Send in Reply")
.setStyle(ButtonStyle.Secondary)

);

await interaction.channel.send({
embeds:[embed],
components:[row]
});

await interaction.editReply("Panel created");

}

};
