import '../string.extensions';
import { ExtendedClient } from './structures/Client';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
export const client = new ExtendedClient();

client.start();
