import { AttachmentBuilder } from 'discord.js';

import Canvas from '@napi-rs/canvas';
import { request } from 'undici';
import { IMAGE } from '../constants/enums/Image';
import { Font } from './fonts';

const IMG_PATH = './src/resources/imgs/';

export class ImageMaker {
  private _canvas: Canvas.Canvas;
  private _width: number;
  private _height: number;
  private _context: Canvas.SKRSContext2D;

  constructor(width = 1024, height = 640) {
    this._width = width;
    this._height = height;
    this._canvas = Canvas.createCanvas(width, height);
    this._context = this._canvas.getContext('2d');
    this._context.fillRect(0, 0, width, height);
    this._context.font = 'normal 60px Cambria';
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  setBackground = async (image: IMAGE) => {
    const path = IMG_PATH + image;
    const background = await Canvas.loadImage(path);
    this._context.drawImage(background, 0, 0, this._width, this._height);
  };

  addImageUrl = async (source: string, x: number, y: number, w: number, h: number) => {
    const { body } = await request(source);
    const image = await Canvas.loadImage(await body.arrayBuffer());
    this._context.drawImage(image, x, y, w, h);
  };
  addImage = async (source: string, x: number, y: number, w?: number, h?: number) => {
    const path = IMG_PATH + source;
    const image = await Canvas.loadImage(path);
    if (w && h) {
      this._context.drawImage(image, x, y, w, h);
    } else {
      this._context.drawImage(image, x, y);
    }
  };

  fill = (x: number, y: number, w: number, h: number, color: string) => {
    this._context.fillStyle = color;
    this._context.fillRect(x, y, w, h);
  };

  measure = (text: string): TextMetrics => {
    return this._context.measureText(text);
  };

  setFont = (font: Font, size: number) => {
    this._context.font = `normal ${size}px "${font}"`;
  };

  addText = async (
    text: string,
    x: number,
    y: number,
    color?: string,
    centerAlign?: boolean,
  ) => {
    this._context.fillStyle = color || '#FFF';
    if (centerAlign) {
      const metrics = this._context.measureText(text);
      x = x - metrics.width / 2;
    }
    this._context.fillText(text, x, y);
  };

  getAttachment = async (name?: string) => {
    return new AttachmentBuilder(await this._canvas.encode('png'), {
      name: name || 'image.png',
    });
  };
}
