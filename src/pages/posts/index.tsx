import { GetStaticProps } from 'next'

import { getPrismicClient } from '../../services/prismic'
import { RichText }         from 'prismic-dom'
import Prismic              from '@prismicio/client'

import Head from 'next/head'
import Link from 'next/link'

import styles from './styles.module.scss'

type Post = {
    slug:      string
    title:     string
    excerpt:   string
    updatedAt: string
}
interface PostsProps {
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head><title>Posts | IgNews</title></Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map((post, index) => (
                        <Link key={index} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    )) }
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        fetch: ['post.title', 'post.content'],
        pageSize: 50,
    })

    const posts = response?.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find((content: { type: string }) => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(String(post.last_publication_date)).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })
        }
    })

    return { props: { posts } }
}