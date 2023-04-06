import './preStart';
import variables from './config/environment/variables';
import { Client, Collection, Events, GatewayIntentBits, Interaction, SlashCommandBuilder } from "discord.js";
import commands from './commands';
import registerSlashCommands from './registerSlashCommands';
interface ClientWithCommands extends Client {
    commands: Collection<string, { data: SlashCommandBuilder, execute: (interaction: Interaction) => Promise<void> }>
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as ClientWithCommands;

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.commands = new Collection();

commands.forEach((command) => {
    client.commands.set(command.data.name, command);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const command = client.commands.get(interaction.commandName);
    console.log(command);
    if(!command) {
        console.error(`no command specified for ${interaction.commandName}`);
    }
    try {
        await command?.execute(interaction);
    } catch (err) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(err);
    }
});

client.on('ready',async () => {
    if(variables.registerCommands) {
        const servers = client.guilds.cache.map(guild => guild.id);
        await registerSlashCommands(servers);
    }
});
// Log in to Discord with your client's token
client.login(variables.botToken);
