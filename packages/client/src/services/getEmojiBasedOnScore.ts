export const getEmojiBasedOnScore = (score: number | undefined) => {
  if (score === undefined) {
    return "🤢";
  }

  if (score < 0) {
    return "😫";
  }
  if (score < 5000) {
    return "😣";
  }
  if (score < 7500) {
    return "😩";
  }
  if (score < 10000) {
    return "🤨";
  }
  if (score < 12500) {
    return "🤯";
  }
  if (score < 15000) {
    return "🤓";
  }
  if (score < 20000) {
    return "😆";
  }
  if (score < 25000) {
    return "🤣";
  }
  if (score < 30000) {
    return "😍";
  }
  return "👹";
};
