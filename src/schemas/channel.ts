import mongoose, { Schema } from 'mongoose';
import { ChannelKey } from '../constants/enums/ChannelKey';
import { reqString } from '../typings/schemaTypes';

export interface Channel {
  key: ChannelKey;
  guildId: string;
  channelId: string;
}

const schema = new Schema<Channel>(
  {
    key: reqString,
    guildId: reqString,
    channelId: reqString,
  },
  {
    timestamps: true,
    collection: 'channel',
  },
);

export default (mongoose.models.Channel as mongoose.Model<Channel>) ||
  mongoose.model('Channel', schema);
