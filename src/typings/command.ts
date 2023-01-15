import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../structures/Client';

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface CallbackOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type CallbackFunction = (options: CallbackOptions) => any;

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  callback: CallbackFunction;
  cooldown?: number;
} & ChatInputApplicationCommandData;
