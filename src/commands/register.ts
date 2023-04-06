import { Interaction, SlashCommandBuilder } from "discord.js";

const execute = async (interaction: Interaction) => {
    if(interaction.isRepliable()) {
        interaction.reply('pong');
    }
};

export default {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a new check'),
    execute,
};
