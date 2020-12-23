console.log((window as any)._env_);
const SERVER_URI = (window as any)._env_.SERVER_URI;
export const config = {
  SERVER_URI:
    process.env.NODE_ENV === "production"
      ? `${SERVER_URI}:5001`
      : "localhost:5001",
};
