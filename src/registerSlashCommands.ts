import { REST, Routes } from 'discord.js';
import commands from './commands';
import variables from './config/environment/environment';

async function registerSlashCommands(servers:string[]):Promise<void> {
    const rest = new REST({ version: '10' }).setToken(variables.bot.token);
    const mappedCommands = commands.map((command) => command.data.toJSON());
    const promises: Promise<boolean>[] = [];
    servers.forEach((serverId) => {
        promises.push(
            rest.put(Routes.applicationGuildCommands(variables.bot.clientId, serverId), {
                body: mappedCommands,
            }).then(() => true).catch(() => false),
        );
    });
    await Promise.all(promises);
    console.log('Registered new slash commands');
    return;
}

export default registerSlashCommands;
