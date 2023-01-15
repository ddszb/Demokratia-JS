import mongoose, { Schema } from 'mongoose';
import { reqString } from '../typings/schemaTypes';

export interface Role {
  name: string;
  guildId: string;
  roleId: string;
}

const schema = new Schema<Role>(
  {
    name: reqString,
    guildId: reqString,
    roleId: reqString,
  },
  {
    timestamps: true,
    collection: 'role',
  },
);

export default (mongoose.models.Role as mongoose.Model<Role>) ||
  mongoose.model('Role', schema);
