import { Theme, DB } from '../../../schemas';

export const createNewTheme = async (
  name: string,
  guildId: string,
  userId: string,
): Promise<Theme> => {
  let theme: Theme | null = await DB.theme.findOne({
    name: { $regex: name, $options: 'i' },
    guildId: guildId,
  });
  if (theme) {
    theme.occurrences += 1;
    await DB.theme.updateOne({ name, guildId: guildId }, theme);
  } else {
    theme = {
      guildId: guildId,
      name: name,
      occurrences: 1,
      repeating: false,
      userId: userId,
    };
    await DB.theme.create(theme);
  }
  return theme;
};
