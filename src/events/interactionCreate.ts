import { ExtendedInteraction } from './../typings/command';
import { Event } from '../structures/Event';
import { client } from '..';
import { CommandInteractionOptionResolver } from 'discord.js';

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    await interaction.deferReply({ ephemeral: command.silent });
    if (!command) return interaction.followUp('Comando não registrado');
    command.callback({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ExtendedInteraction,
    });
  }
});