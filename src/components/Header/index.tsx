import { SignInButton } from '../SignInButton'

import logoImage from '../../../public/images/logo.svg'

import Link from 'next/link'
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
                            <Link href="/">
                                <a className={styles.active}>Home</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/posts">
                                <a>Posts</a>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}