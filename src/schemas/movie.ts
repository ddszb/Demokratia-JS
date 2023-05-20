import { optString, reqBoolean } from './../typings/schemaTypes';
import mongoose, { Schema } from 'mongoose';
import { reqDate, reqString, reqNumber } from '../typings/schemaTypes';

export interface Movie {
  uuid: string;
  mId: number;
  name: string;
  guildId: string;
  userId: string;
  score: number;
  theme: string;
  sessionDate: Date;
  legacy: boolean;
  status: number;
  rateMessageId?: string;
  winningText?: string;
  extraSession?: boolean;
}
const schema = new Schema<Movie>(
  {
    uuid: reqString,
    mId: reqNumber,
    name: reqString,
    guildId: reqString,
    userId: reqString,
    score: reqNumber,
    theme: reqString,
    sessionDate: reqDate,
    legacy: reqBoolean,
    status: reqNumber,
    rateMessageId: optString,
    winningText: optString,
    extraSession: reqBoolean,
  },
  {
    timestamps: true,
    collection: 'movie',
  },
);

export default (mongoose.models.Movie as mongoose.Model<Movie>) ||
  mongoose.model('Movie', schema);
