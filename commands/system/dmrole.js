const { SlashCommandBuilder } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("dmrole")
.setDescription("DM all users in a specific role")
.addRoleOption(o =>
  o.setName("role")
   .setDescription("Role to DM")
   .setRequired(true)
)
.addStringOption(o =>
  o.setName("message")
   .setDescription("Message to send")
   .setRequired(true)
),

async execute(interaction){

try {


await interaction.deferReply({ ephemeral:true });


if(
  !interaction.member.roles.cache.has(process.env.ADMIN_ROLE) &&
  !interaction.member.permissions.has("Administrator")
){
  return interaction.editReply({
    content:"No permission."
  });
}

const role = interaction.options.getRole("role");
const msg = interaction.options.getString("message");


await interaction.editReply({
  content:`📤 Preparing to DM role: **${role.name}**...`
});


await interaction.guild.members.fetch();

const progressMsg = await interaction.channel.send(
  `📤 Starting DM for **${role.name}**...`
);

const members = interaction.guild.members.cache.filter(m =>
  m.roles.cache.has(role.id) && !m.user.bot
);

let total = members.size;
let done = 0;
let success = 0;
let failed = 0;

if(total === 0){
  return progressMsg.edit("❌ No users in that role.");
}

const progressBar = (c, t) => {
  const p = Math.floor((c/t)*100);
  const b = Math.floor(p/10);
  return `[${"█".repeat(b)}${"░".repeat(10-b)}] ${p}%`;
};

for(const member of members.values()){

  try{
    await member.send(msg);
    success++;
  }catch{
    failed++;
  }

  done++;

  if(done % 10 === 0 || done === total){
    await progressMsg.edit(
`📤 Sending DMs to **${role.name}**

${progressBar(done,total)}

👥 ${done}/${total}
✅ ${success} | ❌ ${failed}`
    );
  }

  await new Promise(r => setTimeout(r, 700));
}

await progressMsg.edit(
`✅ DM Complete for **${role.name}**

${progressBar(total,total)}

👥 Total: ${total}
✅ Sent: ${success}
❌ Failed: ${failed}`
);

} catch (err) {

console.error("DMROLE ERROR:", err);

try{
  await interaction.editReply({
    content:"❌ Something went wrong. Check logs."
  });
}catch{}

}

}

};
