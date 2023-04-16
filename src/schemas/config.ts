import mongoose, { Schema } from 'mongoose';
import { reqString } from '../typings/schemaTypes';
import { ConfigKey } from '../constants/enums/ConfigKey';

export interface Config {
  key: ConfigKey;
  guildId: string;
  value: string;
}

const schema = new Schema<Config>(
  {
    key: reqString,
    guildId: reqString,
    value: reqString,
  },
  {
    timestamps: true,
    collection: 'config',
  },
);

export default (mongoose.models.Config as mongoose.Model<Config>) ||
  mongoose.model('Config', schema);
