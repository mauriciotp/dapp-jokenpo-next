import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_ADAPTER_CONTRACT_ADDRESS: z.string(),
})

const { success, data, error } = envSchema.safeParse({
  NEXT_PUBLIC_ADAPTER_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_ADAPTER_CONTRACT_ADDRESS,
})

if (!success) {
  console.error('Invalid environment variables', error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const env = data
