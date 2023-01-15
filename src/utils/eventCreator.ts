import {
  Guild,
  GuildScheduledEvent,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  VoiceChannel,
} from 'discord.js';
import { ChannelKey } from '../constants/enums/ChannelKey';

import { DB } from '../schemas';
import MSG from '../strings';

export const createMovieEvent = async (
  movie: string,
  start: Date,
  guild: Guild,
): Promise<GuildScheduledEvent> => {
  let channel = undefined;
  const channelDoc = await DB.channels.findOne({
    guildId: guild.id,
    key: ChannelKey.VOICE,
  });
  if (channelDoc) {
    channel = guild.channels.cache.get(channelDoc.channelId) as VoiceChannel;
  }
  start.setHours(start.getHours() + 3);
  const end = new Date(start);
  end.setHours(end.getHours() + 2);
  const event = await guild.scheduledEvents.create({
    name: MSG.sessionEventName.parseArgs(movie),
    entityType: GuildScheduledEventEntityType.Voice,
    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
    scheduledStartTime: start,
    scheduledEndTime: end,
    channel: channel,
  });
  return event;
};
