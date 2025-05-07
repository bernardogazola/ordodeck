import { hash, verify } from 'argon2';

const hashString = async (password: string): Promise<string> => {
  return await hash(password);
};

const validateString = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await verify(hashedPassword, plainPassword);
};

export { hashString, validateString };
