import { signIn, signOut, useSession } from 'next-auth/react'// or 'next-auth/client'

import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
    const { data } = useSession()

    console.log(data)

    return data?.user ?
        <button type="button" className={styles.signInButton} onClick={() => signOut()}>
            <FaGithub color='#04d361' />
            { data.user.name ?? 'unnamed' }
            <FiX color='#737380' />
        </button>
        :
        <button type="button" className={styles.signInButton} onClick={() => signIn('github')}>
            <FaGithub color='#eba417' />
            Sign in with Github
        </button>
}