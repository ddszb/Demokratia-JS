import { optString } from './../typings/schemaTypes';
import mongoose, { Schema } from 'mongoose';
import { reqDate, reqString, reqBoolean } from '../typings/schemaTypes';

export interface PollSuggestion {
  pollId: string;
  guildId: string;
  userId: string;
  messageId: string;
  movie: string;
  date: Date;
  winner: boolean;
  winningText?: string;
}
const schema = new Schema<PollSuggestion>(
  {
    pollId: reqString,
    guildId: reqString,
    userId: reqString,
    messageId: reqString,
    movie: reqString,
    date: reqDate,
    winner: reqBoolean,
    winningText: optString,
  },
  {
    timestamps: true,
    collection: 'poll-suggestion',
  },
);

export default (mongoose.models.PollSuggestion as mongoose.Model<PollSuggestion>) ||
  mongoose.model('PollSuggestion', schema);
