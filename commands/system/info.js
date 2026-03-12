const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports={

data:new SlashCommandBuilder()
.setName("info")
.setDescription("NRG bot info"),

async execute(interaction){

const embed = new EmbedBuilder()
.setTitle("NRG Utilities Bot")
.setDescription(`
Commands
Moderation
Link System
Fun
Status

Developer: RVEPRTY
Project: NRG
`);

interaction.reply({embeds:[embed]});

}

};
