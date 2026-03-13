require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");

const loadCommands = require("./core/loader");

const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
]
});

client.on("interactionCreate", async interaction => {

if(!interaction.isButton()) return;

const { EmbedBuilder } = require("discord.js");

if(interaction.customId === "help_mod"){

const embed = new EmbedBuilder()
.setTitle("Moderation Commands")
.setDescription(`
/ban
/kick
/purge
/slowmode
/lock
/unlock
`)
.setColor(0x5865F2);

interaction.reply({embeds:[embed],ephemeral:true});

}

if(interaction.customId === "help_links"){

const embed = new EmbedBuilder()
.setTitle("Link System Commands")
.setDescription(`
/panel
/addlink
/bulkadd
/removelink
`)
.setColor(0x57F287);

interaction.reply({embeds:[embed],ephemeral:true});

}

if(interaction.customId === "help_utils"){

const embed = new EmbedBuilder()
.setTitle("Utility Commands")
.setDescription(`
/info
/status
/op
/help
`)
.setColor(0xFEE75C);

interaction.reply({embeds:[embed],ephemeral:true});

}

if(interaction.customId === "help_fun"){

const embed = new EmbedBuilder()
.setTitle("Fun Commands")
.setDescription(`
/coinflip
`)
.setColor(0xED4245);

interaction.reply({embeds:[embed],ephemeral:true});

}

});

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"));

loadCommands(client);

require("./events/interactionCreate")(client);
require("./events/buttons")(client);
require("./events/ready")(client);

client.login(process.env.TOKEN);
