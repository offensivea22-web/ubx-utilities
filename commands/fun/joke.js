const { SlashCommandBuilder } = require("discord.js");

const jokes = [
"Why don’t skeletons fight each other? They don’t have the guts.",
"I told my computer I needed a break, and it said 'No problem — I’ll go to sleep.'",
"Why did the developer go broke? Because he used up all his cache."
];

module.exports = {
data: new SlashCommandBuilder()
.setName("joke")
.setDescription("Get a random joke"),

async execute(interaction){

const joke = jokes[Math.floor(Math.random() * jokes.length)];
await interaction.reply(`😂 ${joke}`);

}
};
