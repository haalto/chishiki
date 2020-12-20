export function generateRoomCode(): string {
  const code = Math.random().toString(36).substr(2, 5).toUpperCase();
  return code;
}
