import fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { getRandomQuestions } from "./db";

type Query = {
  limit: string;
  lowerDif: string;
  upperDif: string;
};

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

function build(): FastifyInstance {
  server.get("/questions", async (request) => {
    try {
      const limit = (request.query as Query).limit
        ? parseInt((request.query as Query).limit)
        : 1;

      const lowerDif = (request.query as Query).lowerDif
        ? parseFloat((request.query as Query).lowerDif)
        : 0;

      const upperDif = (request.query as Query).upperDif
        ? parseFloat((request.query as Query).upperDif)
        : 1;

      return JSON.stringify(
        await getRandomQuestions(limit, lowerDif, upperDif)
      );
    } catch (e) {
      return e.message;
    }
  });
  return server;
}

export default build;
