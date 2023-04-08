import cron from 'node-cron';
import Schedule from './model/schedule';

interface IScheduledSchedules {
    [k:string]: ReturnType<typeof cron.schedule>
}

class Scheduler {
    static schedules: IScheduledSchedules = {};
    static messageHandler: (schedule: string) => Promise<void>;
    static initialize = (messageHandler: (schedule: string) => Promise<void>) => {
        Scheduler.messageHandler = messageHandler;
        Schedule.find().then((schedules) => {
            schedules.forEach(({ _id, schedule }) => {
                Scheduler.schedules[_id as string] = cron.schedule(schedule, () => messageHandler(_id as string));
            });
            return;
        }).catch(err => {
            console.log(err);
        });
    };

    static append = async (schedule: string) => {
        const scheduleObject = await Schedule.findById(schedule);
        if(!scheduleObject) {
            return false;
        }
        Scheduler.schedules[scheduleObject._id as string] = cron.schedule(
            scheduleObject.schedule, () => Scheduler.messageHandler(scheduleObject._id as string),
        );
        return true;
    };

    static remove = (string: string) => {
        Scheduler.schedules[string].stop();
        delete Scheduler.schedules[string];
    };
}
export default Scheduler;
