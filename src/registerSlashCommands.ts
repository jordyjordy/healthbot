import { REST, Routes } from 'discord.js';
import commands from './commands';
import variables from './config/environment/variables';

async function registerSlashCommands(servers:string[]):Promise<void> {
    const rest = new REST({ version: '10' }).setToken(variables.botToken);
    const mappedCommands = commands.map((command) => command.data.toJSON());
    const promises: Promise<boolean>[] = [];
    servers.forEach((serverId) => {
        promises.push(
            rest.put(Routes.applicationGuildCommands(variables.botClientId, serverId), {
                body: mappedCommands,
            }).then(() => true).catch(() => false),
        );
    });
    await Promise.all(promises);
    return;
}

export default registerSlashCommands;
