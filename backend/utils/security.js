import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function checkPassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  return await bcrypt.compare(password, hashedPassword);
}
