import { Redis } from '@upstash/redis'
import dotenv from "dotenv"
dotenv.config()

export const redis = new Redis({
  url: 'https://adapting-gnu-60903.upstash.io',
  token: 'Ae3nAAIjcDEzZGY3YzI1MDQwMjA0ZjRkYjZhYzgzZjUxN2Q3YmEyZXAxMA',
})

