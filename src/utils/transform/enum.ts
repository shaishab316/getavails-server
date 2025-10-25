export const enum_encode = (str?: string) =>
  str?.trim()?.toUpperCase()?.replace(/ /g, '_');

export const enum_decode = (str?: string) =>
  str?.trim()?.toLowerCase()?.replace(/_/g, ' ');
