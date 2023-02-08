import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import ProductItem from "../../../component/ProductItem"
import MenuIcon from '@mui/icons-material/Menu';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Sidebar from "../../../component/Sidebar"
import { showNotification } from "../../../component/Toast"
import { DataContext } from "../../../context/user"
import SellerAuth from "../../../routes/privateRoutes/seller"
import request from "../../../service/base.service"
import ProductTableView from "../../../component/ProductItem/product_table";
import Select from "../../../component/Dropdown";
import { removeKey } from "../../../utils";
import Loader from "../../../component/Loader";
import Title from "../../../component/Ttitle";
import styles from './styles.module.css'


const ProductDashboard = () => {
    const router = useRouter();
    const { state } = useContext(DataContext)
    const [page, setPage] = useState<number>(1)
    const [sno, setSno] = useState<number>(0)
    const [limit, setLimit] = useState<number>(10)
    const [overallPage, setOverallpage] = useState<number>(1)
    const [filterObj, setFilterObj] = useState({ productname: '', productStatus: '', sellerName: '' })
    const [product, setProduct] = useState<string[]>([])
    const [tab, setTab] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)


    const getProducts = async () => {
        try {
            const removeFalsy: any = await removeKey(filterObj)
            const payload = { page: page, limit: limit, sellerId: state?.auth?.user?._id, filterObj: removeFalsy }
            if (payload.sellerId) {
                setLoading(true)
                await request({ url: '/api/product/product', method: 'patch', data: payload }).then((res: any) => {
                    if (res.status === 'success') {
                        setLoading(false)
                        setProduct(res.data)
                        setOverallpage(Math.ceil((res.totalcount / limit)))
                    } else {
                        showNotification(false, res.message)
                    }
                })
            }
        } catch (error: any) {
            showNotification(false, error?.data.message)
        }
    }
    const handleChangeStautus = (e: any) => {
        setFilterObj({ ...filterObj, productStatus: e.target.value })
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
        getProducts();
    }, [state.auth, page, limit, filterObj])
    return (
        <>
            <Title title="product" />
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <div className="newProduct">
                        <div>
                            <h4>Product List</h4>
                        </div>
                        <div style={{ cursor: 'pointer' }}>
                            <LibraryAddIcon onClick={() => router.push('/addproduct')} />
                            <MenuIcon onClick={() => setTab(!tab)} />
                        </div>
                    </div>
                    <div>
                        {tab &&
                            <div className='row m-2'>
                                <div className="col-3">
                                    <label className='dropdown'>Product Name Search</label><br />
                                    <input type='text' className={styles.input} placeholder="search product" value={filterObj.productname} onChange={(e: any) => setFilterObj({ ...filterObj, productname: e.target.value })} />
                                </div>
                                <div className="col-3">
                                    <label className='dropdown'>Sellar Name Search</label><br />
                                    <input type='text' className={styles.input} placeholder="search seller" value={filterObj.sellerName} onChange={(e: any) => setFilterObj({ ...filterObj, sellerName: e.target.value })} />
                                </div>
                                <div className="col-3">
                                    <Select data={[{ _id: 'APPROVED', name: 'Approved' }, { _id: 'PENDING', name: 'Pending' }, { _id: 'REJECTED', name: 'Rejected' }]} label='Product Status' handlechange={handleChangeStautus} />
                                </div>
                            </div>}
                        {loading ? <Loader /> : <>
                            {tab ? <ProductTableView sno={0} data={product} route={`/seller/productlist`} pagination={pagination} overallPage={overallPage} /> : <ProductItem data={product} pagination={pagination} overallPage={overallPage} />}
                        </>}
                    </div>
                </div>
            </div>
        </>
    )
}
export default SellerAuth(ProductDashboard)