const CODE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 8;

export function generateTrackingCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}
