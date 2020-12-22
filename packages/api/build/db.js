"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomQuestions = exports.db = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
exports.db = new pg_1.Client({
    user: config_1.PGUSER,
    host: config_1.PGHOST,
    database: config_1.PGDATABASE,
    password: config_1.PGPASSWORD,
    port: config_1.PGPORT,
});
exports.db.connect();
const checkLimit = (limit) => {
    if (limit < 1) {
        return 1;
    }
    if (limit > 10) {
        return 10;
    }
    return limit;
};
const checkDifficultyValue = (value) => {
    if (value < 0) {
        return 0;
    }
    if (value > 1) {
        return 1;
    }
    return value;
};
const getRandomQuestions = (limit, lowerDif, upperDif) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield exports.db.query("SELECT id::int, question, answers, answer::int, category, difficulty::float  FROM data.final_questions WHERE difficulty BETWEEN $2 AND $3 OFFSET floor(random() * ( SELECT COUNT(*) FROM data.final_questions WHERE difficulty BETWEEN $2 AND $3)) LIMIT $1;", [
        checkLimit(limit),
        checkDifficultyValue(lowerDif),
        checkDifficultyValue(upperDif),
    ]);
    return question.rows;
});
exports.getRandomQuestions = getRandomQuestions;
//# sourceMappingURL=db.js.map