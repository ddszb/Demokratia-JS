import mongoose, { Schema } from 'mongoose';
import {
  optNumber,
  optString,
  reqDate,
  reqNumber,
  reqString,
} from '../typings/schemaTypes';

export interface Poll {
  pollId: string;
  guildId: string;
  status: number;
  theme: string;
  numVotes?: number;
  messageId?: string;
  winner?: string;
  date: Date;
}
const schema = new Schema<Poll>(
  {
    pollId: reqString,
    guildId: reqString,
    status: reqNumber,
    theme: reqString,
    numVotes: optNumber,
    messageId: optString,
    winner: optString,
    date: reqDate,
  },
  {
    timestamps: true,
    collection: 'poll',
  },
);

export default (mongoose.models.Poll as mongoose.Model<Poll>) ||
  mongoose.model('IPoll', schema);
