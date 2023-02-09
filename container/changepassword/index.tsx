import Input from "../../component/Input"
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import request from "../../service/base.service";
import { showNotification } from "../../component/Toast";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*.?&])[A-Za-z\d#@$!%*.?&]{8,}$/


const schema = yup.object().shape({
    username: yup.string().required("Please Enter the Email or Mobile"),
    password: yup.string().trim().required('Please Enter the Password').min(8, "Please Enter password with a minimum of 8 characters").matches(passwordRegex, "Password Should contain a minimum of 8 characters which includes 1 Upper case, 1 Lower case, 1 special character, 1 number"),
    confirmpassword: yup.string().required("Please Enter the Confirm-Password").min(8, "Must be 8 characters").when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Both password must match"
        )
    })
});
const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const onsubmitHandler = async (data: any) => {
        await request({ url: 'api/auth/changepassword', method: 'post', data: data }).then((res: any) => {
            if (res.status === 'success') {
                showNotification(true, res.message)
                reset()
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }

    const inputStyle: any = {
        width: '100%',
        padding: '10px',
        margin: '5px 0 5px 0',
        display: 'inline-block',
        border: 'none',
        background: '#f1f1f1'
    }
    return (
        <>
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col">
                        <div className="p-3 py-5">
                            <form onSubmit={handleSubmit(onsubmitHandler)}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Change Password</h4>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12"><label className="labels">Email or Mobile</label>
                                        <Input register={register} name="username" type="text" error={errors?.username?.message} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12"><label className="labels">Password</label>
                                        <Input register={register} name="password" type="password" error={errors?.password?.message} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12"><label className="labels">ConfirmPassword</label>
                                        <Input register={register} name="confirmpassword" type="password" error={errors?.confirmpassword?.message} style={inputStyle} />
                                    </div>
                                </div>
                                <button className="btn btn-primary profile-button mt-5 text-center" type="submit">Change Password</button>
                            </form>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}
export default ChangePassword