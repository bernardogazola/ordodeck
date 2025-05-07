export const isEmptyObj = (obj: object) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export const concatStr = (
  strings: (number | string)[],
  divider?: string,
): string => strings.join(divider ?? ' ');

export const getRandomInt = (min: number, max: number) => {
  const minCelled = Math.ceil(min),
    maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCelled) + minCelled);
};

export * from './argon2';
export * from './validateEnv';
