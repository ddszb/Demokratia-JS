import {
  AutocompleteInteraction,
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

type AutoCompleteFunction = (interaction: AutocompleteInteraction) => any;

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  callback: CallbackFunction;
  autoComplete?: AutoCompleteFunction;
  cooldown?: number;
  silent: boolean;
} & ChatInputApplicationCommandData;
