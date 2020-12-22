export const config = {
  SERVER_URI:
    process.env.NODE_ENV === "production"
      ? `${process.env.REACT_APP_SERVER_URI}:5001`
      : "localhost:5001",
};
