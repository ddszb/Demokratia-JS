import {
  ColorResolvable,
  MessageComponentInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import MSG from '../strings';

export type PageItem = {
  label: string;
};

/**
 * Class for embed messages pagination
 */
export class Paginator {
  private _page: number;
  private _title: string;
  private _showPosition: boolean;
  private _items: PageItem[];
  private _pageSize: number;
  private _thumbnail?: string;
  private _description?: string;
  private _color?: ColorResolvable;
  private _showPageNumber?: boolean;
  private _totalPages: number;
  private _timedOut: boolean;

  constructor(
    title: string,
    showPosition: boolean,
    items: PageItem[],
    pageSize: number,
    thumbnail?: string,
    description?: string,
    color?: ColorResolvable,
    showPageNumber?: boolean,
  ) {
    this._page = 0;
    this._title = title;
    this._showPosition = showPosition;
    this._items = items;
    this._pageSize = pageSize;
    this._thumbnail = thumbnail;
    this._description = description;
    this._color = color;
    this._showPageNumber = showPageNumber;
    this._totalPages = Math.ceil(items.length / pageSize);
    this._timedOut = false;
  }

  /**
   * Creates an object representing the message payload for the client to send.
   * @returns The message payload
   */
  getReply() {
    return {
      embeds: [this.getCurrentPage()],
      components: [this.getRow()],
    };
  }

  /**
   * Creates the buttons for the paginator
   * @returns MessageActionRow containing the buttons
   */
  getRow(): ActionRowBuilder<ButtonBuilder> {
    if (this._timedOut) {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('set')
          .setEmoji('🔒')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
      );
    }
    return new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('first')
          .setEmoji('⏮')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(this._page === 0),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setEmoji('⏪')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(this._page === 0),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('next')
          .setEmoji('⏩')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(this._page === this._totalPages - 1),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('last')
          .setEmoji('⏭')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(this._page === this._totalPages - 1),
      );
  }

  /**
   * Creates and returns an embed of the current page
   * @returns MessageEmbed representing the current page
   */
  getCurrentPage(): EmbedBuilder {
    let sliceOffset = this._page * this._pageSize;

    const pageItems = this._items.slice(sliceOffset, sliceOffset + this._pageSize);
    const itemsText =
      '\n' +
      pageItems
        .map(
          (item, index) =>
            `${this._showPosition ? `#${index * this._page}` : ''} ${item.label}`,
        )
        .join('\n');
    const embed = new EmbedBuilder()
      .setTitle(`${this._title}`)
      .setFields([{ name: MSG.empty, value: itemsText }]);
    if (this._description) embed.setDescription(this._description);
    if (this._color) embed.setColor(this._color);
    if (this._thumbnail) embed.setDescription(this._thumbnail);

    if (this._showPageNumber) {
      embed.setFooter({ text: `${this._page + 1} de ${this._totalPages}` });
    }

    return embed;
  }

  /**
   * Updates the current page of the paginator
   * @param btnInt Button Interaction with id of the button pressed
   * @returns
   */
  onPageChange(btnInt: MessageComponentInteraction): void {
    if (!btnInt) return;
    if (!btnInt.deferred) btnInt.deferUpdate();
    if (
      btnInt.customId !== 'first' &&
      btnInt.customId !== 'prev' &&
      btnInt.customId !== 'next' &&
      btnInt.customId !== 'last'
    )
      return;
    // Update the current page
    if (btnInt.customId === 'first' && this._page > 0) this._page = 0;
    else if (btnInt.customId === 'prev' && this._page > 0) --this._page;
    else if (btnInt.customId === 'next' && this._page < this._totalPages - 1)
      ++this._page;
    else if (btnInt.customId === 'last' && this._page < this._totalPages - 1)
      this._page = this._totalPages - 1;
  }

  /**
   * To be called when the collector ends, sets the paginator as timed out
   */
  onTimeOut() {
    this._timedOut = true;
  }
}
