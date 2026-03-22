const fs = require("fs");

module.exports = (client) => {

    client.commands = new Map();

    const folders = fs.readdirSync("./commands");

    for (const folder of folders) {

        const files = fs.readdirSync(`./commands/${folder}`);

        for (const file of files) {

            
            if (!file.endsWith(".js")) continue;

            const command = require(`../commands/${folder}/${file}`);

       
            if (!command.data || !command.execute) {
                console.log(`⚠ Skipping ${folder}/${file} (missing data or execute)`);
                continue;
            }

            client.commands.set(command.data.name, command);
        }
    }

};
