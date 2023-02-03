
import { useRouter } from 'next/router';
import styles from './error.module.css'
type error = {
    errorType: string
    refer?: any
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Error: React.FC<error> = ({ errorType, refer }) => {
    const router = useRouter()
    const trigerBack = () => {
        refer?.current.click()
    }
    return (
        <>
            <div className={styles.error}>
                <h1>{errorType}</h1>
                <button type='submit' onClick={() => refer ? trigerBack() : router.replace('/')}>Go back</button>
            </div>
        </>
    )

}
export default Error