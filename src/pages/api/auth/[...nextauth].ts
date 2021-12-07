import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna'

import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: { params: { scope: 'read:user' } }
        }),
    ],
    callbacks: {/*
        async session({session}) {
            try {
                const userActiveSubscription = await fauna.query(
                    q.Get(
                        q.Intersection([
                            q.Match(q.Index('subscription_by_user_ref')),
                            q.Match(q.Index('user_by_email'), q.Casefold(!!session?.user?.email)),
                        ])
                    )
                )

                /**
                 * @todo Verificar se membro é ativo diretamente na consulta do banco de dados
                 *
                if (userActiveSubscription['data']['status'] === 'active') {
                    return {
                        ...session,
                        activeSubscription: userActiveSubscription
                    }
                }
            } catch (err) {
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },*/
        async signIn({ user, account, profile }) {
            const { email } = user

            if (!email) return false

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(email)
                            )
                        )
                    )
                )
                return true
            } catch (err) { console.log(err); return false }
        },
    }
})