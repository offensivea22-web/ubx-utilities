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


if(interaction.user.id !== process.env.OWNER_ID){
  return interaction.reply({ content:"Owner only command.", ephemeral:true });
}


await interaction.deferReply({ ephemeral:true });

const msg = interaction.options.getString("message");

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


await interaction.editReply({
  content:`📤 Starting DM process...\n${progressBar(0, total)}`
});


for(const member of users.values()){

  try{
    await member.send(msg);
    success++;
  }catch{
    failed++;
  }

  done++;

 
  if(done % 10 === 0 || done === total){
    await interaction.editReply({
      content:
`📤 Sending DMs...

${progressBar(done, total)}

👥 ${done}/${total}
✅ ${success} | ❌ ${failed}`
    });
  }

 
  await new Promise(r => setTimeout(r, 1200));
}


await interaction.editReply({
  content:
`✅ DM Complete!

${progressBar(total, total)}

👥 Total: ${total}
✅ Sent: ${success}
❌ Failed: ${failed}`
});

}

};
