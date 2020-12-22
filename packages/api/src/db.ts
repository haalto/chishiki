import { Client } from "pg";
import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from "./config";
import { Question } from "./types";
export const db = new Client({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT as number,
});

db.connect();

const checkLimit = (limit: number): number => {
  if (limit < 1) {
    return 1;
  }

  if (limit > 10) {
    return 10;
  }

  return limit;
};

const checkDifficultyValue = (value: number) => {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
};

export const getRandomQuestions = async (
  limit: number,
  lowerDif: number,
  upperDif: number
): Promise<Question[]> => {
  const question = await db.query<Question>(
    "SELECT id::int, question, answers, answer::int, category, difficulty::float  FROM data.final_questions WHERE difficulty BETWEEN $2 AND $3 OFFSET floor(random() * ( SELECT COUNT(*) FROM data.final_questions WHERE difficulty BETWEEN $2 AND $3)) LIMIT $1;",
    [
      checkLimit(limit),
      checkDifficultyValue(lowerDif),
      checkDifficultyValue(upperDif),
    ]
  );
  return question.rows;
};
