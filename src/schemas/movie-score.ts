import { optString } from './../typings/schemaTypes';
import mongoose, { Schema } from 'mongoose';
import { reqString, reqNumber } from '../typings/schemaTypes';

export interface MovieScore {
  movieId: string;
  guildId: string;
  userId: string;
  score: number;
  winningText?: string;
}

const schema = new Schema<MovieScore>(
  {
    movieId: reqString,
    guildId: reqString,
    userId: reqString,
    score: reqNumber,
    winningText: optString,
  },
  {
    timestamps: true,
    collection: 'movie-score',
  },
);

export default (mongoose.models.MovieScore as mongoose.Model<MovieScore>) ||
  mongoose.model('MovieScore', schema);
