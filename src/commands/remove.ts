import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Schedule from "../model/schedule";

const execute = async (interaction: ChatInputCommandInteraction) => {
    if(!interaction.guildId) {
        interaction.reply('You can only execute this command from a server.');
        return;
    }
    const serverId = interaction.guildId;
    const name = interaction.options.get('name')?.value as string;
    try {
        const res = await Schedule.removeSchedule(serverId, name);
        if(res) {
            interaction.reply(`Removed the check: ${name}.`);
            return;
        } else {
            interaction.reply(
                `Could not remove the check: ${name}, perhaps it does not exist or is still in use`,
            );
            return;
        }

    } catch (err) {
        interaction.reply(
            'Something went wrong while trying to join the schedule.',
        );
        return;
    }
    return;
};

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .addStringOption(option => option.setName('name').setDescription('name of the check').setRequired(true))
        .setDescription('remove a check'),
    execute,
};
