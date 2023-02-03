import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../component/Input";
import request from "../../service/base.service";
import styles from './login.module.css'
import Link from "next/link";
import { showNotification } from "../../component/Toast";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { DataContext } from "../../context/user";

const schema = yup.object().shape({
    name: yup.string().required('Please Enter a Name'),
    password: yup.string().trim().required().min(8, "Please Enter password with a minimum of 8 characters")
});
const Login = () => {
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onsubmitHandler = async (data: any) => {
        await request({ url: 'api/auth/login', method: 'post', data: data }).then(async (res: any) => {
            if (res.status === 'success') {
                showNotification(true, res.message)
                localStorage.setItem('firstlogin', 'true')
                localStorage.setItem('token', res.access_token)
                dispatch({ type: 'AUTH', payload: { user: res.data } })
                if (res?.data?.role?.includes('ADMIN')) {
                    router.push('/admin/user')
                }
                if (res?.data?.role?.includes('SELLER')) {
                    router.push('/seller/productlist')
                }
                reset();
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }
    useEffect(() => {
        if (auth?.token) router.push("/")
    }, [auth])
    return (
        <>
            <div className={styles.loginForm}>
                <div className={styles.login}>
                    <form onSubmit={handleSubmit(onsubmitHandler)}>
                        <Input label="Email or Mobile" register={register} name="name" type="text" error={errors?.name?.message} className={styles.input} />
                        <Input label="Password" register={register} name="password" type="password" error={errors?.password?.message} className={styles.input} />
                        <button className={styles.btn}>Login</button>
                    </form>
                    <div className={styles.signin}>
                        <p>Create new a account? <Link href='/register'>Register</Link>.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login