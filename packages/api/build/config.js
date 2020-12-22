"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PGPORT = exports.PGDATABASE = exports.PGPASSWORD = exports.PGHOST = exports.PGUSER = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.PORT = process.env.PORT || 4000;
exports.PGUSER = process.env.PGUSER;
exports.PGHOST = process.env.PGHOST;
exports.PGPASSWORD = process.env.PGPWASSWORD;
exports.PGDATABASE = process.env.PGDATABASE;
exports.PGPORT = process.env.PGPORT || 5432;
//# sourceMappingURL=config.js.map