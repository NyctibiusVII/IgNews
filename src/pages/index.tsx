import { GetStaticProps } from 'next'
import { stripe } from '../services/stripe'

import { SubscribeButton } from '../components/SubscribeButton';

import avatarImage from '../../public/images/avatar.svg'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/home.module.scss'

interface HomeProps {
    product: {
        priceId: string
        amount:  number
    }
}

export default function Home({ product }: HomeProps): JSX.Element {
    return (
        <>
            <Head><title>Home | IgNews</title></Head>

            <main className={styles.contentContainer}>
                <section className={styles.hero}>
                    <span>👏Hey, Welcome</span>
                    <h1>News about<br />the <span>React</span> World.</h1>
                    <p>
                        Get access to all the publications<br />
                        <span>for {product.amount} mouth</span>
                    </p>

                    <SubscribeButton priceId={product.priceId} />
                </section>

                <Image
                    src={avatarImage}
                    alt="Girl coding"
                    width={200}
                    height={200}
                />
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const price = await stripe.prices.retrieve(process.env.STRIPE_PRODUCT_PRICE as string)

    const product = {
        priceId: price.id,
        amount: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number(price.unit_amount) / 100),
    }

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}