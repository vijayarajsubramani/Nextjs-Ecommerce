import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../../component/Input";
import styles from './category.module.css'
import { showNotification } from "../../../component/Toast";
import request from "../../../service/base.service";
import { useForm } from "react-hook-form";
import Table from "./table";
import Pagination from "../../../component/Pagination";
import Loader from "../../../component/Loader";

const schema = yup.object().shape({
    name: yup.string().required('Please enter the category name'),
});

const Category = () => {
    const [category, setCategory] = useState<string[]>([])
    const [catId, setCatId] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(5)
    const [sno, setSno] = useState<number>(0)
    const [overallPage, setOverallpage] = useState<number>(1)
    const [sortObj, setSortObj] = useState({ createdAt: 1 })
    const [loading,setLoading]=useState<boolean>(false)
    const [sorttoggle, setSorttoggle] = useState<boolean>(false);


    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onsubmitHandler = async (data: any) => {
        try{
            if (catId) data.categoryId = catId
            await request({ url: '/api/category/category', method: catId ? 'put' : 'post', data: data }).then((res: any) => {
                if (res.status === 'success') {
                    showNotification(true, res.message)
                    getCategory()
                    cancel()
                }
            }).catch((err: any) => {
                showNotification(false, err.data.message)
            })
        }catch(err:any){
            showNotification(false, err.data.message)
        }
    }
    const deleteCategory = async (id: string) => {
        try{
            await request({ url: '/api/category/category', method: 'delete', data: { categoryId: id } }).then((res: any) => {
                if (res.status === 'success') {
                    showNotification(true, res.message)
                    getCategory()
                    cancel()
                }
            }).catch((err: any) => {
                showNotification(false, err.data.message)
            })
        }catch(err:any){
            showNotification(false, err.data.message)
        }
    }
    const getCategory = async () => {
        try{
            setLoading(true)
            await request({ url: '/api/category/category', method: 'patch', data: { page: page, limit: limit,sortObj:sortObj } }).then((res: any) => {
                if (res.status === 'success') {
                    setCategory(res.data)
                    setOverallpage(Math.ceil((res.totalcount / limit)))
                    setLoading(false)
                }
            }).catch((err: any) => {
                showNotification(false, err.data.message)
            })
        }catch(err:any){
            showNotification(false, err.data.message)
        }
    }
    const editCategory = (item: any) => {
        setCatId(item?._id)
        setValue('name', item?.name)
    }
    const cancel = () => {
        setCatId('');
        reset({ name: '' })
    }
    const pagination = (e: any, data: any) => {
        e.preventDefault();
        let pag: number = 0
        setPage(data)
        if (data !== 0) {
            pag = limit * (data - 1)
            setSno(pag)
        }
    }
    useEffect(() => {
        getCategory()
    }, [page, limit,sortObj])

    return (
        <>
            <div className={styles.registerForm}>
                <div className={styles.register}>
                    <form onSubmit={handleSubmit(onsubmitHandler)}>
                        <Input label="Category Name" register={register} name="name" type="text" error={errors?.name?.message} className={styles.input} />
                        <button type="submit" className='btn btn-info mx-1'>{catId ? 'Update' : 'Create'}</button>
                        {catId && <button type="button" className='btn btn-secondary' onClick={cancel}>Cancel</button>}
                    </form>
                </div>
               { loading ? <Loader/> :<div className="w-100 mx-3">
                    <Table data={category} sno={sno} editCategory={editCategory} deleteCategory={deleteCategory} sort={setSortObj} setSorttoggle={setSorttoggle} sorttoggle={sorttoggle} />
                    {category.length > 0 && <Pagination page={overallPage} variant='outlined' shape='rounded' pagination={(e: any, data: any) => pagination(e, data)} />}
                </div>}

            </div>
        </>
    )
}
export default Category