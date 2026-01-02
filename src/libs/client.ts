import { treaty } from '@elysiajs/eden'
import type { app } from '../app/api/[[...slugs]]/route'

// .api to enter /api prefix
export const client =
  typeof window !== 'undefined'
    ? treaty<typeof app>('http://localhost:3000').api
    : treaty<typeof app>('http://localhost:3000').api
