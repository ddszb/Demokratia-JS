import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from './../../../structures/Command';
import { sendScore } from './score';

export default new Command({
  name: 'nota',
  description: MSG.scoreValueDescription,
  silent: true,
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'valor',
      description: MSG.scoreValueOpDescription,
      minValue: 0,
      maxValue: 100,
      required: true,
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    sendScore(interaction);
  },
});
