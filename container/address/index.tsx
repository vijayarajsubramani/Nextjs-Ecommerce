import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import styles from './styles.module.css'
import Input from '../../component/Input';
import Select from '../../component/Dropdown';
import request from '../../service/base.service';
import { showNotification } from '../../component/Toast';
import { useContext, useEffect } from 'react';
import { DataContext } from '../../context/user';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
    name: yup.string().required("Please Enter the Name"),
    address: yup.string().required("Please Enter the Address"),
    city: yup.string().required("Please Enter the City"),
    district: yup.string().required("Please Enter the District"),
    state: yup.string().required("Please Enter the State"),
    country: yup.string().required("Please Enter the Country"),
    mobile: yup.string().required('Please Enter the Mobile Number').matches(phoneRegExp, 'Phone number is not valid').min(10, 'mobile number must be 10 numbers').max(10, 'mobile number must not exceed 10 numbers'),
    pincode: yup.string().required("Please Enter the Pincode").min(6, 'Pincode must be 6 digits').max(6, 'Pincode must not exceed 6 digits'),
    addressType: yup.string().required("Please choose the addressType"),
});
interface Tprops {
    value?: any,
    close?:(e:boolean)=>void,
    reload?:()=>void
}
const CreateAddress: React.FC<Tprops> = ({ value,reload,close }) => {
    const { state } = useContext(DataContext)

    const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const handleChange = (e: any) => {
        setValue('addressType', e.target.value)
    }
    const onsubmitHandler = async (data: any) => {
        if (data && value?._id) data.addressId = value?._id
        if (data) data.buyerId = state.auth?.user?._id
        await request({ url: '/api/address/address', method: value?._id ? 'put' : 'post', data: data }).then((res: any) => {
            if (res.status === 'success') {
                if(reload)reload()
                if(close)close(false)
                showNotification(true, res.message)
                reset()
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }
    const dispatchData = () => {
        setValue('name', value?.name)
        setValue('address', value?.address)
        setValue('city', value?.city)
        setValue('state', value?.state)
        setValue('district', value?.district)
        setValue('country', value?.country)
        setValue('pincode', value?.pincode)
        setValue('mobile', value?.mobile)
        setValue('addressType', value?.addressType)
    }
    useEffect(() => {
        dispatchData()
    }, [value])

    return (
        <>
            <div className={styles.addressForm}>
                <h5>{value?._id ? 'Update your delivery address' : 'Enter your delivery address'}</h5>
                <div>
                    <form onSubmit={handleSubmit(onsubmitHandler)}>
                        <div className='row'>
                            <div className='col-6'>
                                <Input label="Name" register={register} name="name" type="text" error={errors?.name?.message} className={styles.input} />
                            </div>
                            <div className='col-6'>
                                <Input label="Address" register={register} name="address" type="text" error={errors?.address?.message} className={styles.input} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <Input label="City" register={register} name="city" type="text" error={errors?.city?.message} className={styles.input} />
                            </div>
                            <div className='col-6'>
                                <Input label="District" register={register} name="district" type="text" error={errors?.district?.message} className={styles.input} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <Input label="State" register={register} name="state" type="text" error={errors?.state?.message} className={styles.input} />
                            </div>
                            <div className='col-6'>
                                <Input label="Country" register={register} name="country" type="text" error={errors?.country?.message} className={styles.input} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <Input label="Pincode" register={register} name="pincode" type="text" error={errors?.pincode?.message} className={styles.input} />
                            </div>
                            <div className='col-6'>
                                <Input label="Mobile" register={register} name="mobile" type="text" error={errors?.mobile?.message} className={styles.input} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <Select label='Address Type' data={[{ _id: 'office', name: 'Office' }, { _id: 'home', name: 'Home' }]} Id={value?.addressType} error={errors?.mobile?.message} handlechange={handleChange} />
                            </div>
                            <div className='col-6'>
                                <button className='brn btn-primary m-4'>{value?._id ? 'Update' : 'Create'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default CreateAddress