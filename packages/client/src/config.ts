export const config = {
  SERVER_URI:
    process.env.NODE_ENV === "production"
      ? `${(window as any)._env_.SERVER_URI}:5001`
      : "localhost:5001",
};
