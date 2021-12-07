import { SignInButton } from '../SignInButton'
import { ActiveLink }   from '../ActiveLink'

import logoImage from '../../../public/images/logo.svg'

import Link  from 'next/link'
import Image from 'next/image'

import styles from './styles.module.scss'

export function Header() {
    return (
        <header className={styles.container}>
            <div className={styles.content}>
                <Link href="/" passHref>
                    <Image
                        src={logoImage}
                        alt="IgNews"
                    />
                </Link>

                <nav>
                    <ul>
                        <li>
                            <ActiveLink activeClassName={styles.active} href="/">
                                <a>Home</a>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink activeClassName={styles.active} href="/posts">
                                <a>Posts</a>
                            </ActiveLink>
                        </li>
                    </ul>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}