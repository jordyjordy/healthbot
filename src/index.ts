import './preStart';
import environment from './config/environment/environment';
import {
    ChatInputCommandInteraction,
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
} from "discord.js";
import mongoose from 'mongoose';
import commands from './commands';
import registerSlashCommands from './registerSlashCommands';
import Schedule from './model/schedule';
import Scheduler from './scheduler';
interface ClientWithCommands extends Client {
    commands: Collection<
        string,
        { data: SlashCommandBuilder, execute: (interaction: ChatInputCommandInteraction) => Promise<void> }
    >
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
    if(environment.bot.registerCommands) {
        const servers = client.guilds.cache.map(guild => guild.id);
        await registerSlashCommands(servers);
    }
});

const messageHandler = async (schedule: string) => {
    try {
        const actualSchedule = await Schedule.findById(schedule);
        if(!actualSchedule) {
            Scheduler.remove(schedule);
            return;
        }
        console.log(`informing ${actualSchedule.subscribers.length} users for ${actualSchedule.name}`);
        actualSchedule.subscribers.forEach((user) => {
            client.users.fetch(user).then((clientUser) => {
                clientUser.send(actualSchedule.message);
                return;
            }).catch(err => {
                console.error('could not send message', err);
            });
        });
    } catch (err) {
        // do nothing
    }
};

mongoose.connect(environment.mongoDb.url).then(() => {
    console.log("Connected to database!");
    client.login(environment.bot.token);
    Scheduler.initialize(messageHandler);
    return;
}).catch((err) => {
    console.log(err);
});
