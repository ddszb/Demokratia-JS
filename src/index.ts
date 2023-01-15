import moment from 'moment';
import '../string.extensions';
import { ExtendedClient } from './structures/Client';
require('dotenv').config();
moment.locale('pt-br');
export const client = new ExtendedClient();

client.start();
