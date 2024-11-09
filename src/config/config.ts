import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
};

export const prisma = new PrismaClient();
