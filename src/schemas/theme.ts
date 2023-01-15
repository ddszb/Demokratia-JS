import mongoose, { Schema } from 'mongoose';
import { reqBoolean, reqString, reqNumber } from '../typings/schemaTypes';

export interface Theme {
  guildId: string;
  name: string;
  repeating: boolean;
  userId: string;
  occurrences: number;
}
const schema = new Schema<Theme>(
  {
    guildId: reqString,
    name: reqString,
    repeating: reqBoolean,
    userId: reqString,
    occurrences: reqNumber,
  },
  {
    timestamps: true,
    collection: 'theme',
  },
);

export default (mongoose.models.Theme as mongoose.Model<Theme>) ||
  mongoose.model('Theme', schema);
