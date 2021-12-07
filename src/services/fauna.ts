import { Client } from 'faunadb'

export const fauna = new Client({
    secret: process.env.FAUNADB_KEY ?? 'Error: FAUNADB_KEY => undefined',
    domain: 'db.us.fauna.com',
    scheme: 'https',
})