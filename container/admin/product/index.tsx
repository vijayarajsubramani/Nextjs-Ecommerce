import { useContext, useEffect, useState } from "react"
import Table from "./table"
import styles from './styles.module.css'
import request from "../../../service/base.service";
import { showNotification } from "../../../component/Toast";
import Pagination from "../../../component/Pagination";
import Sidebar from "../../../component/Sidebar";
import Select from "../../../component/Dropdown";
import { DataContext } from "../../../context/user";
import { removeKey } from '../../../utils'
import Loader from "../../../component/Loader";



const ProductAdmin = () => {
    const { state } = useContext(DataContext)
    const { auth } = state;
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(5)
    const [overallPage, setOverallpage] = useState<number>(1)
    const [sno, setSno] = useState<number>(0)
    const [filterObj, setFilterObj] = useState({ productname: '', categoryName: '', productStatus: '', sellerName: '' })
    const [sortObj, setSortObj] = useState({ createdAt: 1 })
    const [product, setProduct] = useState<string[]>([])
    const [category, setCategory] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [sorttoggle, setSorttoggle] = useState<boolean>(false);


    const getProducts = async () => {
        try {
            const removeFalsy: any = await removeKey(filterObj)
            const payload = { page: page, limit: limit, filterObj: removeFalsy, sortObj: removeKey(sortObj) }
            setLoading(true)
            await request({ url: '/api/product/product', method: 'patch', data: payload }, auth.token).then((res: any) => {
                if (res.status === 'success') {
                    setProduct(res?.data)
                    setOverallpage(Math.ceil((res.totalcount / limit)))
                    setLoading(false)
                } else {
                    showNotification(false, res.message)
                }
            }).catch((error:any)=>{
                showNotification(false, error?.data?.message)

            })
        } catch (error: any) {
            showNotification(false, error?.data?.message)
        }
    }
    const getCategory = async () => {
        setLoading(true)
        await request({ url: '/api/category/category', method: 'patch', data: { page: page, limit: 1000 } }, auth.token).then((res: any) => {
            if (res.status === 'success') {
                setLoading(false)
                const arrObj = res?.data?.map((item: any) => {
                    return {
                        _id: item?.name,
                        name: item?.name
                    }
                })
                setCategory(arrObj)
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
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
    const handleChangeStautus = (e: any) => {
        setFilterObj({ ...filterObj, productStatus: e.target.value })
    }
    const handleChangeCategory = (e: any) => {
        setFilterObj({ ...filterObj, categoryName: e.target.value })
    }
    useEffect(() => {
        getCategory()
    }, [])
    useEffect(() => {
        getProducts();
    }, [page, limit, sortObj,filterObj])

    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <h4>All Seller Product</h4>
                    <div>
                        <div className={styles.productsearch}>
                            <div className="row">
                                <div className="col-3">
                                    <label className='dropdown'>Product Name Search</label><br />
                                    <input type='text' className={styles.input} placeholder="search product" value={filterObj.productname} onChange={(e: any) => setFilterObj({ ...filterObj, productname: e.target.value })} />
                                </div>
                                <div className="col-3">
                                    <label className='dropdown'>Sellar Name Search</label><br />
                                    <input type='text' className={styles.input} placeholder="search seller" value={filterObj.sellerName} onChange={(e: any) => setFilterObj({ ...filterObj, sellerName: e.target.value })} />
                                </div>
                                <div className="col-3">
                                    <Select data={category} label='Category' handlechange={handleChangeCategory} />
                                </div>
                                <div className="col-3">
                                    <Select data={[{ _id: 'APPROVED', name: 'Approved' }, { _id: 'PENDING', name: 'Pending' }, { _id: 'REJECTED', name: 'Rejected' }]} label='Product Status' handlechange={handleChangeStautus} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                        </div>
                        {loading ? <Loader /> : <div className="w-100 mx-4">
                            <Table data={product} sno={sno} route='/admin/product' sort={setSortObj} setSorttoggle={setSorttoggle} sorttoggle={sorttoggle}/>
                            {product.length > 0 && <Pagination page={overallPage} variant='outlined' shape='rounded' pagination={(e: any, data: any) => pagination(e, data)} />}
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}
export default ProductAdmin