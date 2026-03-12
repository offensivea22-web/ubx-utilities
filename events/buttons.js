const Links = require("../database/links");
const Usage = require("../database/usage");

module.exports = (client)=>{

client.on("interactionCreate",async interaction=>{

if(!interaction.isButton()) return;

if(!interaction.customId.startsWith("link")) return;

const WEEK = 604800000;
const now = Date.now();

let user = await Usage.findOne({userId:interaction.user.id});

if(!user){

user = await Usage.create({
userId:interaction.user.id,
weekStart:now,
count:0
});

}

if(now - user.weekStart > WEEK){

user.weekStart = now;
user.count = 0;

}

let limit = 1;

if(
interaction.member.roles.cache.has(process.env.PREMIUM_ROLE) ||
interaction.member.roles.cache.has(process.env.BOOSTER_ROLE)
){
limit = 3;
}

if(user.count >= limit){

return interaction.reply({
content:"Weekly link limit reached.",
ephemeral:true
});

}

const link = await Links.findOneAndUpdate(
{used:false},
{used:true,claimedBy:interaction.user.id,claimedAt:now}
);

if(!link){

return interaction.reply({
content:"No links available.",
ephemeral:true
});

}

user.count++;
await user.save();

if(interaction.customId === "link_dm"){

try{

await interaction.user.send(`Your NRG Link:\n${link.url}`);

await interaction.reply({
content:"Check your DMs!",
ephemeral:true
});

}catch{

interaction.reply({
content:"Enable DMs to receive links.",
ephemeral:true
});

}

}

if(interaction.customId === "link_reply"){

interaction.reply({
content:`Your NRG Link:\n${link.url}`,
ephemeral:true
});

}

});

};
