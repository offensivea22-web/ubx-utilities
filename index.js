require("dotenv").config();

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const mongoose = require("mongoose");

const loadCommands = require("./core/loader");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,  
    Partials.Message,
    Partials.User
  ]
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));


loadCommands(client);


require("./events/interactionCreate")(client);
require("./events/buttons")(client);
require("./events/ready")(client);
require("./events/dmRelay")(client);     



client.login(process.env.TOKEN);


client.once("ready", () => {
  console.log(`${client.user.tag} is ONLINE`);
});
