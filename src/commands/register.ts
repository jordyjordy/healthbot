import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Schedule from "../model/schedule";
import Scheduler from "../scheduler";
import cron from 'node-cron';

const execute = async (interaction: ChatInputCommandInteraction) => {
    if(!interaction.guildId) {
        interaction.reply('You can only execute this command from a server');
        return;
    }
    // eslint-disable-next-line max-len
    const schedule = (interaction.options.get('schedule')?.value ?? '') as string;
    const validCron = cron.validate(schedule);
    if(!validCron) {
        interaction.reply('the schedule you provided is not correct.');
        return;
    }
    const userId = interaction.user.id;
    const serverId = interaction.guildId;
    const name = interaction.options.get('name')?.value as string;
    const message = interaction.options.get('message')?.value as string;
    const desktop = (interaction.options.get('desktop-only')?.value ?? false) as boolean;
    try {
        const newSchedule = await Schedule.createNewSchedule(userId, name, schedule, serverId, message, desktop);
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
        .addBooleanOption(
            option => option.setName('desktop-only')
                .setDescription('The checks will only be sent if you are available on desktop')
        )
        .setDescription('Register a new check'),
    execute,
};
