import { z } from 'zod'

const serverEnvSchema = z.object({
  INFURA_SECRET: z.string(),
})

const { success, data, error } = serverEnvSchema.safeParse(process.env)

if (!success) {
  console.error('Invalid environment variables', error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const serverEnv = data
