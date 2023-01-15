import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB, Theme } from '../../../schemas';
import { v4 as uuid } from 'uuid';

export const createPoll = async (theme: Theme, guildId: string) => {
  await DB.poll.create({
    pollId: `${theme.name}_${uuid()}`,
    guildId,
    status: PollStatus.ACTIVE,
    date: new Date(),
    theme: theme.name,
  });
};
