import { DB } from './../schemas/index';
import { ClientEvents } from 'discord.js';
import { CommandType } from '../typings/command';
import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  GatewayIntentBits,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { RegisterCommandsOptions } from '../typings/client';
import { Event } from './Event';
import mongoose from 'mongoose';
const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
  }

  start() {
    this.registerModules();
    this.login(process.env.TOKEN);
    this.connect();
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
      console.log(`Registrando comando para ${guildId}`);
    } else {
      this.application?.commands.set(commands);
      console.log('Registrando comando global');
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*/*index{.ts,.js}`,
    );
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) return;
      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.GUILD_ID,
      });
    });

    // Event
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });
  }

  async connect() {
    if (process.env.MONGO_URL) {
      mongoose.connect(process.env.MONGO_URL);
      console.log('DB connected');
    }
  }
}
