import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../component/Input";
import styles from './styles.module.css'
import { showNotification } from "../../component/Toast";
import request from "../../service/base.service";
import { useForm } from "react-hook-form";
import Select from "../../component/Dropdown";
import Imageuploader from "../../component/Imageupload";
import { imageUpload } from '../../common/imageupload'
import { useRouter } from "next/router";
import ProductApproval from "./productApproval";
import ActionButton from "../../component/Actionbutton";

const schema = yup.object().shape({
    productname: yup.string().required('Please enter the product name'),
    images: yup.array().required('Please upload atleast one field'),
    price: yup.string().required('Please enter the price'),
    quantity: yup.string().required('Please enter the quantity'),
    categoryId: yup.string().required("Please select a category"),
    description: yup.string().required("Please select a category"),
});
interface Tprops {
    product?: any,
    user?: any
}

const Addproduct: React.FC<Tprops> = ({ product, user }) => {
    const router = useRouter()
    const [category, setCategory] = useState<string[]>([])
    const [productImage, setProductimage] = useState<string[]>([])
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });

    const onsubmitHandler = async (data: any) => {
        try {
            if (data && product?._id) data.productId = product?._id
            if (data && user?.role.includes('SELLER')) data.sellerId = user?._id
            await imageUpload(productImage).then((res: any) => data.images = res)
            await request({ url: '/api/product/product', method: product?._id ? 'put' : 'post', data: data }).then((res: any) => {
                showNotification(true, res.message)
                user?.role.includes('ADMIN') ? router.push('/admin/product') : router.push('/seller/productlist')
            }).catch((err: any) => {
                showNotification(false, err.data.message)
            })
        }
        catch (err: any) {
            showNotification(false, err)
        }
    }
    const getCategory = async () => {
        await request({ url: '/api/category/category', method: 'patch', data: { page: 1, limit: 1000 } }).then((res: any) => {
            if (res.status === 'success') {
                setCategory(res.data)
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }

    const handleChange = (e: any) => {
        setValue('categoryId', e.target.value)
    }
    const dispatchData = () => {
        setValue('productname', product?.productname)
        setValue('price', product?.price)
        setValue('quantity', product?.quantity)
        setValue('images', productImage ?? product?.images)
        setProductimage(product?.images ?? [])
        setValue('categoryId', product?.categoryId)
        setValue('description', product?.description)
    }

    useEffect(() => {
        dispatchData();
    }, [product])

    useEffect(() => {
        getCategory();
    }, [])

    return (
        <>
            <div className={styles.registerForm}>
                <div className={styles.register}>
                    <div className={styles.approve}>
                        <ProductApproval product={product} />
                    </div>
                    <form onSubmit={handleSubmit(onsubmitHandler)}>
                        <Input label="Product Name" register={register} name="productname" type="text" error={errors?.productname?.message} className={styles.input} />
                        <Imageuploader limit={2} description='Add Image' tagValue={setProductimage} patchValue={productImage} error={errors?.images?.message} />
                        <Select data={category} label='Category' Id={product?.categoryId} error={errors?.categoryId?.message} handlechange={handleChange} />
                        <Input label="Price" register={register} name="price" type="text" error={errors?.price?.message} className={styles.input} />
                        <Input label="Quantity" register={register} name="quantity" type="text" error={errors?.quantity?.message} className={styles.input} />
                        <Input label="Description" register={register} name="description" type="textarea" error={errors?.description?.message} className={styles.input} />
                        <ActionButton className="btn btn-info my-2" text={product?._id ? 'Update' : 'Create'} />
                    </form>
                </div>
            </div>
        </>
    )
}
export default Addproduct