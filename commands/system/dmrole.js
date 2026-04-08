const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()
.setName("dmrole")
.setDescription("DM all users in a role with live status")
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
  return interaction.editReply({ content:"No permission." });
}

const role = interaction.options.getRole("role");
const msg = interaction.options.getString("message");

await interaction.editReply(`📤 Starting DM process for **${role.name}**...`);


await interaction.guild.members.fetch();

const members = interaction.guild.members.cache.filter(m =>
  m.roles.cache.has(role.id) && !m.user.bot
);

let total = members.size;
let done = 0;
let success = 0;
let failed = 0;

let logs = [];

const progressBar = (c, t) => {
  const p = Math.floor((c/t)*100);
  const b = Math.floor(p/10);
  return `[${"█".repeat(b)}${"░".repeat(10-b)}] ${p}%`;
};

const embed = new EmbedBuilder()
.setTitle(`📤 DM Progress - ${role.name}`)
.setColor("#00AEEF")
.setDescription("Starting...")
.setFooter({ text:"XCloud DM System" });

const progressMsg = await interaction.channel.send({ embeds:[embed] });

for(const member of members.values()){

  let status;

  try{
    const dm = await member.createDM();
    await dm.send(msg);
    success++;
    status = `✅ <@${member.id}>: DMED`;
  }catch{
    failed++;
    status = `❌ <@${member.id}>: FAILED`;
  }

  logs.push(status);
  done++;

  
  const recentLogs = logs.slice(-10).join("\n");

  
  if(done % 2 === 0 || done === total){

    const updatedEmbed = new EmbedBuilder()
    .setTitle(`📤 DM Progress - ${role.name}`)
    .setColor("#00AEEF")
    .setDescription(
`${progressBar(done,total)}

👥 ${done}/${total}
✅ ${success} | ❌ ${failed}

**Recent Activity:**
${recentLogs || "None"}`
    )
    .setFooter({ text:"Xcloud DM System" });

    await progressMsg.edit({ embeds:[updatedEmbed] });
  }

  await new Promise(r => setTimeout(r, 800));
}


const finalEmbed = new EmbedBuilder()
.setTitle(`✅ DM Complete - ${role.name}`)
.setColor("#00FF88")
.setDescription(
`${progressBar(total,total)}

👥 Total: ${total}
✅ Sent: ${success}
❌ Failed: ${failed}`
)
.setFooter({ text:"XCloud DM System" });

await progressMsg.edit({ embeds:[finalEmbed] });

}

};
