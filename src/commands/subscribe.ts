import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Schedule from "../model/schedule";

const execute = async (interaction: ChatInputCommandInteraction) => {
    if(!interaction.guildId) {
        interaction.reply('You can only execute this command from a server.');
        return;
    }
    const userId = interaction.user.id;
    const serverId = interaction.guildId;
    const name = interaction.options.get('name')?.value as string;
    try {
        const res = await Schedule.addSubscriber(serverId, name, userId);
        if(res) {
            interaction.reply(`Subscribed to the check: ${name}.`);
            return;
        } else {
            interaction.reply(
                `Could not subscribe to the check: ${name},`
                + ` either it does not exist or you are already added.`,
            );
            return;
        }

    } catch (err) {
        interaction.reply(
            'Something went wrong while trying to join the check.',
        );
        return;
    }
    return;
};

export default {
    data: new SlashCommandBuilder()
        .setName('subscribe')
        .addStringOption(option => option.setName('name').setDescription('name of the check').setRequired(true))
        .setDescription('Subscribe to a check'),
    execute,
};
