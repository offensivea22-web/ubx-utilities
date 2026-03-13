const { SlashCommandBuilder } = require("discord.js");
const Links = require("../../database/links");

module.exports = {

data: new SlashCommandBuilder()
.setName("stock")
.setDescription("Check link stock"),

async execute(interaction){

await interaction.deferReply({ephemeral:true});

const total = await Links.countDocuments();
const used = await Links.countDocuments({ used: true });

const available = total - used;

interaction.editReply(
`NRG Link Stock\n\nAvailable: ${available}\nTotal: ${total}`
);

}

};
