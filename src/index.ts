import moment from 'moment';
import '../string.extensions';
import { ExtendedClient } from './structures/Client';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
moment.locale('pt-br');
export const client = new ExtendedClient();

client.start();
