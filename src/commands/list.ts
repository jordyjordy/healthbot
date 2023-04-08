import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Schedule from "../model/schedule";

const execute = async (interaction: ChatInputCommandInteraction) => {
    if(!interaction.guildId) {
        interaction.reply('You can only execute this command from a server.');
        return;
    }
    let schedules = [];
    const subscribedChecks = interaction.options.get('subscribed-checks')?.value ?? false;
    if(subscribedChecks) {
        schedules = await Schedule.findByUserAndServer(interaction.user.id, interaction.guildId);
    } else {
        schedules = await Schedule.findByServerId(interaction.guildId);
    }

    if(schedules.length === 0) {
        if(subscribedChecks) {
            interaction.reply('You are not subscribed to any checks');
        } else {
            interaction.reply('No checks exist yet.');
        }
        return;
    }
    const reply = schedules.map((schedule) => `name: ${schedule.name}, schedule: ${schedule.schedule}`).join('\n');
    interaction.reply(`Found checks:\n${reply}.`);
    return;
};

export default {
    data: new SlashCommandBuilder()
        .setName('list')
        .addBooleanOption(option => option
            .setName('subscribed-checks')
            .setDescription('Only show checks you are described to on this server'))
        .setDescription('List all ehecks'),
    execute,
};
