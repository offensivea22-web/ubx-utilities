const { SlashCommandBuilder } = require("discord.js");
const mongoose = require("mongoose");

const Warn = mongoose.models.Warn;

module.exports = {

data: new SlashCommandBuilder()
.setName("warnings")
.setDescription("View user warnings")
.addUserOption(o =>
o.setName("user").setDescription("User").setRequired(true)),

async execute(interaction){

const user = interaction.options.getUser("user");

const data = await Warn.findOne({ userId: user.id });

if(!data || data.warnings.length === 0){
return interaction.reply({content:"No warnings found.", ephemeral:true});
}

const list = data.warnings.map((w, i) =>
`${i+1}. ${w.reason}`
).join("\n");

interaction.reply({content:list, ephemeral:true});

}

};
