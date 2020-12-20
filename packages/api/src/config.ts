import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 4000;
export const PGUSER = process.env.PGUSER;
export const PGHOST = process.env.PGHOST;
export const PGPASSWORD = process.env.PGPWASSWORD;
export const PGDATABASE = process.env.PGDATABASE;
export const PGPORT = process.env.PGPORT || 5432;
