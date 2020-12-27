export const config = {
  API_URI:
    process.env.NODE_ENV === "production" ? process.env.API_URI : "localhost",
};
