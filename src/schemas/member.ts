import { reqBoolean } from './../typings/schemaTypes';
import mongoose, { Schema } from 'mongoose';
import { reqString, reqNumber } from '../typings/schemaTypes';

export interface Member {
  userId: string;
  guildId: string;
  exp: number;
  active: boolean;
}

const schema = new Schema<Member>(
  {
    userId: reqString,
    guildId: reqString,
    exp: reqNumber,
    active: reqBoolean,
  },
  {
    timestamps: true,
    collection: 'member',
  },
);

export default (mongoose.models.Member as mongoose.Model<Member>) ||
  mongoose.model('Member', schema);
