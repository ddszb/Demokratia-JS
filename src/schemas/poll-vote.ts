import { reqNumber } from './../typings/schemaTypes';
import mongoose, { Schema } from 'mongoose';
import { reqDate, reqString } from '../typings/schemaTypes';

export interface PollVote {
  pollId: string;
  guildId: string;
  userId: string;
  movie: string;
  date: Date;
  votingIndex: number;
}
const schema = new Schema<PollVote>(
  {
    pollId: reqString,
    guildId: reqString,
    userId: reqString,
    movie: reqString,
    date: reqDate,
    votingIndex: reqNumber,
  },
  {
    timestamps: true,
    collection: 'poll-vote',
  },
);

export default (mongoose.models.PollVote as mongoose.Model<PollVote>) ||
  mongoose.model('PollVote', schema);
