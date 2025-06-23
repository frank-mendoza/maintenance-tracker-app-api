import bcrypt from "bcryptjs";
interface ComparePasswordParams {
  password: string;
  hashedPassword: string;
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export async function comparePassword(
  password: ComparePasswordParams["password"],
  hashedPassword: ComparePasswordParams["hashedPassword"]
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
