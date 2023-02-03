import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Input from "../../component/Input"
import { DataContext } from "../../context/user";
import ProfileImage from "./image";

const mailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
    name: yup.string().required("Please Enter the Name"),
    email: yup.string().required('Please Enter the Email').matches(mailRegex, 'Enter a valid mail').max(100, "email shoul not exeed 100 characters"),
    mobile: yup.string().required('Please Enter the Mobile Number').matches(phoneRegExp,'Phone number is not valid').min(10, 'mobile number must be 10 numbers').max(10, 'mobile number must not exceed 10 numbers'),
    avatar:yup.string().required('Please upload your profile')
});
const Profile=()=>{
    const {state}=useContext(DataContext)
    const {name,mobile,email ,avatar}=state?.auth?.user ?? {}
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });

    const onsubmitHandler = async (data: any) => {}
    const dispatchData = () => {
        setValue('name',name )
        setValue('mobile',mobile )
        setValue('email',email )
        setValue('avatar',avatar )
    }
    useEffect(()=>{
        dispatchData()
    },[state?.auth])
return(
    <>
    <div className="container rounded bg-white mt-5 mb-5 ">
        <div className="row">
            <div className="col-md-3">
            <ProfileImage error={errors?.avatar?.message} avatar={avatar}/>
            </div>
            <div className="col" >
                <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Profile Settings</h4>
                    </div>
                    <div className="row mt-2">
                        <div className="col-12"><label className="labels">Name</label>
                        <Input register={register} name="name" type="text" error={errors?.name?.message}  />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12"><label className="labels">Mobile Number</label>
                        <Input  register={register} name="mobile" type="number" error={errors?.mobile?.message}  />
                        </div>
                    </div>
                    <div className="row mt-3">
                    <div className="col-12"><label className="labels">Email ID</label>
                        <Input  register={register} name="email" type="text" error={errors?.email?.message}  />
                        </div>
                    </div>
                    <div className="mt-5 text-center">
                        <form onSubmit={handleSubmit(onsubmitHandler)}>
                        <button className="btn btn-primary profile-button" type="submit" >Save Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</>
    )
}
export default Profile