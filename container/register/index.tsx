import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../component/Input";
import styles from './register.module.css'
import Link from "next/link";
import { showNotification } from "../../component/Toast";
import request from "../../service/base.service";
import RegisterRole from "./role";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*.?&])[A-Za-z\d#@$!%*.?&]{8,}$/
const mailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


const schema = yup.object().shape({
    role: yup.string().required('Please the select Role').nullable(),
    name: yup.string().required("Please Enter the Name"),
    email: yup.string().required('Please Enter the Email').matches(mailRegex, 'Enter a valid mail').max(100, "email shoul not exeed 100 characters"),
    mobile: yup.string().required('Please Enter the Mobile Number').matches(phoneRegExp,'Phone number is not valid').min(10, 'mobile number must be 10 numbers').max(10, 'mobile number must not exceed 10 numbers'),
    password: yup.string().trim().required('Please Enter the Password').min(8, "Please Enter password with a minimum of 8 characters").matches(passwordRegex, "Password Should contain a minimum of 8 characters which includes 1 Upper case, 1 Lower case, 1 special character, 1 number"),
    confirmpassword: yup.string().required("Please Enter the Confirm-Password").min(8, "Must be 8 characters").when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Both password must match"
        )
    })
});
const Register = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onsubmitHandler = async (data: any) => {
        if(data.confirmpassword) delete data.confirmpassword
        await request({ url: 'api/auth/register', method: 'post', data: data }).then((res: any) => {
            if (res.status === 'success') {
                showNotification(true, res.message)
                reset()
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }
    return (
        <>
            <div className={styles.registerForm}>
                <div className={styles.register}>
                    <form onSubmit={handleSubmit(onsubmitHandler)}>
                        <RegisterRole register={register} errors={errors?.role?.message}/>
                        <Input label="Name" register={register} name="name" type="text" error={errors?.name?.message} className={styles.input} />
                        <Input label="Email" register={register} name="email" type="email" error={errors?.email?.message} className={styles.input} />
                        <Input label="Mobile" register={register} name="mobile" type="number" error={errors?.mobile?.message} className={styles.input} />
                        <Input label="Password" register={register} name="password" type="password" error={errors?.password?.message} className={styles.input} />
                        <Input label="Confirm-Password" register={register} name="confirmpassword" type="password" error={errors?.confirmpassword?.message} className={styles.input} />
                        <button className={styles.btn}>Register</button>
                    </form>
                    <div className={styles.signin}>
                        <p>Already have an account? <Link href='/login'>Sign in</Link>.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Register