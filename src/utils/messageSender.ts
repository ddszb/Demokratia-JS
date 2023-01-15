import { Guild, GuildScheduledEvent, TextChannel } from 'discord.js';
import { ChannelKey } from '../constants/ChannelKeyEnum';
import { MChannel, Movie, MRole } from '../models';
import { DB } from '../schemas';
import { movieDateEmbed } from './embedCreator';

/**
 * Sends a message to main movie channel for a new session created
 * @param movie The movie on the future session
 * @param event The scheduled event created
 * @param guild The current guild
 */
export const sendMovieEventMessage = async (
	movie: Movie,
	event: GuildScheduledEvent,
	guild: Guild
) => {
	const eventEmbed = await movieDateEmbed(movie, event);
	const role: MRole | null = await DB.roles.findOne({
		guildId: guild.id,
	});
	const mainChannel: MChannel | null = await DB.channels.findOne({
		guildId: guild.id,
		key: ChannelKey.MAIN,
	});
	if (mainChannel) {
		const notificationChannel = guild.channels.cache.get(
			mainChannel.channelId
		) as TextChannel;
		await notificationChannel.send({
			embeds: [eventEmbed],
			content: role ? `<@&${role.roleId}>` : '',
		});
	}
};
