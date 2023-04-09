import mongoose from "mongoose";

export interface ISchedule extends mongoose.Document {
    serverId: string,
    name: string,
    schedule: string,
    message: string,
    desktopOnly: boolean,
    subscribers: string[]
}

interface IScheduleModel extends mongoose.Model<ISchedule> {
    findByServerId(server: string): Promise<ISchedule[]>,
    findByName(name:string, server: string): Promise<ISchedule | null>,
    findByUserAndServer(user: string, server: string): Promise<ISchedule[]>,
    addSubscriber(server:string, name:string, userId: string): Promise<boolean>,
    removeSubscriber(server:string, name:string, userId: string): Promise<boolean>,
    removeSchedule(server:string, name:string): Promise<boolean>,
    createNewSchedule(
        userId: string, name: string, schedule: string, serverId: string, message: string, desktopOnly?: boolean
    ): Promise<ISchedule>
}

const scheduleSchema = new mongoose.Schema<ISchedule>({
    serverId: {
        type: String,
        require: [true, "We need a server id"],
    },
    name: {
        type: String,
        require: [true, "We need a name"],
    },
    schedule: {
        type: String,
    },
    message: {
        type: String,
        require: [true, "We need a message"],
    },
    desktopOnly: {
        type: Boolean,
    },
    subscribers: {
        type: [
            {
                type: String,
            },
        ],
    },
});

scheduleSchema.index({ serverId: 1, name: 1}, { unique: true });

scheduleSchema.statics.findByServerId = async (server: string): Promise<ISchedule[]> => {
    return (await Schedule.find({ serverId: server }));
};

scheduleSchema.statics.findByName = async(name: string, server: string): Promise<ISchedule | null> => {
    return (await Schedule.findOne({ serverId: server, name }));
};

scheduleSchema.statics.findByUserAndServer = async(user: string, server: string): Promise<ISchedule[]> => {
    return (await Schedule.find({ serverId: server, subscribers: user }));
};

scheduleSchema.statics.addSubscriber = async (server:string, name:string, userId: string): Promise<boolean> => {
    const schedule = await Schedule.findByName(name, server);
    if(schedule && !schedule.subscribers.some((user) => user === userId)) {
        schedule.subscribers.push(userId);
        await schedule.save();
        return true;
    }
    return false;
};

scheduleSchema.statics.removeSubscriber = async (server:string, name:string, userId: string): Promise<boolean> => {
    const schedule = await Schedule.findByName(name, server);
    if(schedule && schedule.subscribers.some((user) => user === userId)) {
        schedule.subscribers = schedule.subscribers.filter((id) => id !== userId);
        await schedule.save();
        return true;
    }
    return false;
};

scheduleSchema.statics.removeSchedule = async (server:string, name:string): Promise<boolean> => {
    const schedule = await Schedule.findByName(name, server);
    if(schedule && (!schedule.subscribers || schedule.subscribers.length === 0)) {
        await schedule.deleteOne();
        return true;
    }
    return false;
};

scheduleSchema.statics.createNewSchedule = async (
    userId: string, name: string, schedule: string, serverId: string, message: string, desktopOnly: boolean = false,
) => {
    const scheduleObject = new Schedule({
        name,
        serverId,
        schedule,
        subscribers: [userId],
        message,
        desktopOnly,
    });

    return scheduleObject.save();
};

const Schedule = mongoose.model<ISchedule, IScheduleModel>("schedule", scheduleSchema);
export default Schedule;
