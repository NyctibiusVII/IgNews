import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data } = useSession()
    const router = useRouter()

    const handleSubscribe = async () => {
        if (!data) {
            signIn('github')
            return
        }
        if (data.activeSubscription) {
            console.log('Usuário já tem uma assinatura ativa')
            
            router.push('/posts')
            return
        }

        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data

            const stripe = await getStripeJs()

            await stripe?.redirectToCheckout({ sessionId })
        } catch(err) { alert(err) }
    }

    return <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
        Subscribe now
    </button>
}