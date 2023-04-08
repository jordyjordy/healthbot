import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Schedule from "../model/schedule";
import Scheduler from "../scheduler";

const execute = async (interaction: ChatInputCommandInteraction) => {
    if(!interaction.guildId) {
        interaction.reply('You can only execute this command from a server');
        return;
    }
    // eslint-disable-next-line max-len
    const cronregex = new RegExp(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/);
    const schedule = (interaction.options.get('schedule')?.value ?? '') as string;
    const validCron = cronregex.test(schedule);
    if(!validCron) {
        interaction.reply('the schedule you provided is not correct.');
        return;
    }
    const userId = interaction.user.id;
    const serverId = interaction.guildId;
    const name = interaction.options.get('name')?.value as string;
    const message = interaction.options.get('message')?.value as string;
    try {
        const newSchedule = await Schedule.createNewSchedule(userId, name, schedule, serverId, message);
        Scheduler.append(newSchedule._id as string);
        interaction.reply(`New check created: ${name}`);
    } catch (err) {
        interaction.reply(
            'Something went wrong while trying to create the check,\nThe name might already be in use.',
        );
    }
    return;
};

export default {
    data: new SlashCommandBuilder()
        .setName('register')
        .addStringOption(option => option.setName('name').setDescription('A name for the check').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('A message to be sent').setRequired(true))
        .addStringOption(
            option => option.setName('schedule')
                .setDescription('A cron schedule to follow')
                .setRequired(true),
        )
        .setDescription('Register a new check'),
    execute,
};
