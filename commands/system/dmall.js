const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("dmall")
.setDescription("DM everyone in the server")
.addStringOption(o =>
  o.setName("message")
   .setDescription("Message to send")
   .setRequired(true)
)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

async execute(interaction){


if(!interaction.member.roles.cache.has(process.env.ADMIN_ROLE)){
  return interaction.reply({
    content:"You do not have permission to use this command.",
    ephemeral:true
  });
}

const msg = interaction.options.getString("message");


await interaction.reply({
  content:"📤 DM process started. Check channel for progress.",
  ephemeral:true
});

const progressMsg = await interaction.channel.send("📤 Starting DM process...");

const members = await interaction.guild.members.fetch();
const users = members.filter(m => !m.user.bot);

let total = users.size;
let done = 0;
let success = 0;
let failed = 0;

const progressBar = (current, total) => {
  const percent = Math.floor((current / total) * 100);
  const bars = Math.floor(percent / 10);
  return `[${"█".repeat(bars)}${"░".repeat(10 - bars)}] ${percent}%`;
};

for(const member of users.values()){

  try{
    await member.send(msg);
    success++;
  }catch{
    failed++;
  }

  done++;

  if(done % 15 === 0 || done === total){
    await progressMsg.edit(
`📤 Sending DMs...

${progressBar(done, total)}

👥 ${done}/${total}
✅ ${success} | ❌ ${failed}`
    );
  }

  await new Promise(r => setTimeout(r, 800));
}

await progressMsg.edit(
`✅ DM Complete!

${progressBar(total, total)}

👥 Total: ${total}
✅ Sent: ${success}
❌ Failed: ${failed}`
);

}

};
