require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const botToken = process.env.TGLSC_BOT_TOKEN;
const apiTokens = Object.keys(process.env)
    .filter(k => k.startsWith('TGLSC_API_'))
    .sort()
    .map(k => process.env[k]);

const icons = {
    fortiguard: '🛡️ FortiGuard',
    lightspeed: '🚦 Lightspeed',
    paloalto: '🪵 Palo Alto',
    blocksiweb: '🧱 Blocksi Web',
    blocksiai: '🤖 Blocksi AI',
    linewize: '🍋‍🟩 Linewize',
    cisco: '☂️ Cisco Umbrella',
    securly: '⚛️ Securly',
    goguardian: '🔒 GoGuardian',
    lanschool: '🏫 LanSchool',
    contentkeeper: '🧹 ContentKeeper',
    aristotle: '🥏 AristotleK12',
    senso: '🌳 Senso Cloud',
    deledao: '😈 Deledao',
    iboss: '💼 iBoss',
    barracuda: '🦞 Barracuda',
    dnsfilter: '📡 DNSFilter',
    qustodio: '🪼 Qustodio',
    sophos: '🐳 Sophos'
};

const getStatus = (blocked, error) => {
    if (error) return '⚠️ Error';
    return blocked ? '❌ Likely Blocked' : '✅ Likely Unblocked';
};

const fetchCheck = async (url, filter) => {
    for (const token of apiTokens) {
        try {
            const endpoint = filter 
                ? `https://live.glseries.net/api/v1/check?token=${token}&url=${encodeURIComponent(url)}&filter=${filter}`
                : `https://live.glseries.net/api/v1/check?token=${token}&url=${encodeURIComponent(url)}`;
            const res = await fetch(endpoint);
            const data = await res.json();
            if (data.success) return data;
        } catch (e) {}
    }
    return null;
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    try {
        const filtersRes = await fetch('https://live.glseries.net/api/v1/filters');
        const filtersData = await filtersRes.json();
        
        const command = new SlashCommandBuilder()
            .setName('check')
            .setDescription('Check a URL against web filters')
            .addSubcommand(subcmd =>
                subcmd
                    .setName('all')
                    .setDescription('Check URL against all available filters')
                    .addStringOption(opt => opt.setName('url').setDescription('The URL to check').setRequired(true))
            );

        if (Array.isArray(filtersData)) {
            for (const filter of filtersData) {
                const filterKey = filter.filter || filter.key || filter.id || (typeof filter === 'string' ? filter : null);
                const filterName = filter.name || filterKey;
                if (!filterKey) continue;
                
                command.addSubcommand(subcmd =>
                    subcmd
                        .setName(filterKey.toLowerCase().replace(/[^a-z0-9]/g, ''))
                        .setDescription(`Check URL against ${filterName}`)
                        .addStringOption(opt => opt.setName('url').setDescription('The URL to check').setRequired(true))
                );
            }
        }

        const rest = new REST({ version: '10' }).setToken(botToken);
        await rest.put(Routes.applicationCommands(client.user.id), { body: [command.toJSON()] });
    } catch (e) {}
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'check') return;

    await interaction.deferReply();

    const url = interaction.options.getString('url');
    const subcommand = interaction.options.getSubcommand();
    
    const isAll = subcommand === 'all';
    const filterToUse = isAll ? null : subcommand;

    const result = await fetchCheck(url, filterToUse);

    if (!result) {
        return interaction.editReply('Failed to fetch results. Tokens may be exhausted or the API is currently unreachable.');
    }

    const embed = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(`Results for ${url}`);

    if (isAll) {
        let description = '';
        for (const res of result.results) {
            const iconStr = icons[res.filter] || `❓ ${res.name}`;
            const statusStr = getStatus(res.blocked, res.error);
            description += `${iconStr} | ${res.category} - ${statusStr}\n`;
        }
        embed.setDescription(description || 'No results found.');
    } else {
        const res = result.results[0];
        if (!res) {
            return interaction.editReply('Filter not found or no result returned.');
        }
        const iconStr = icons[res.filter] || `❓ ${res.name}`;
        const statusStr = getStatus(res.blocked, res.error);
        embed.setDescription(`${iconStr} | ${res.category} - ${statusStr} - \`${res.responseTime}ms\``);
    }

    await interaction.editReply({ embeds: [embed] });
});

client.login(botToken);
