import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
    const isUserLoggedIn = true

    const user = { name: 'John Doe' }

    return isUserLoggedIn ?
        <button type="button" className={styles.signInButton}>
            <FaGithub color='#04d361' />
            { user.name }
            <FiX color='#737380' />
        </button>
        :
        <button type="button" className={styles.signInButton}>
            <FaGithub color='#eba417' />
            Sign in with Github
        </button>
}