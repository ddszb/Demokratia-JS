import '../string.extensions';
import { ExtendedClient } from './structures/Client';
import dotenv from 'dotenv';
import { loadFonts } from './utils/fonts';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
export const client = new ExtendedClient();

loadFonts();

client.start();
