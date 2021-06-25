const { verify } = require("hcaptcha");

export async function validateCaptcha(
  token: string,
  key: string
): Promise<boolean> {
  const { success } = await verify(token, key);

  if (!success) return false;
  else return true;
}
