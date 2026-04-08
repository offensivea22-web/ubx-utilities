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
  content:`📤 Fetching members for role: **${role.name}**...`
});


await interaction.guild.members.fetch({ time: 15000 }).catch(() => null);


const members = interaction.guild.members.cache.filter(m =>
  m.roles.cache.has(role.id) && !m.user.bot
);

let total = members.size;
let done = 0;
let success = 0;
let failed = 0;

const progressMsg = await interaction.channel.send(
  `📤 Starting DM for **${role.name}**...`
);

if(total === 0){
  return progressMsg.edit("❌ No users found in that role.");
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

  if(done % 5 === 0 || done === total){
    await progressMsg.edit(
`📤 Sending DMs to **${role.name}**

${progressBar(done,total)}

👥 ${done}/${total}
✅ ${success} | ❌ ${failed}`
    );
  }

  await new Promise(r => setTimeout(r, 500));
}

await progressMsg.edit(
`✅ DM Complete for **${role.name}**

${progressBar(total,total)}

👥 Total: ${total}
✅ Sent: ${success}
❌ Failed: ${failed}`
);
  

}

};
