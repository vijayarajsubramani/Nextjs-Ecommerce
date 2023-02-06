import { useContext, useEffect, useState } from "react"
import Loader from "../../../component/Loader"
import ProductTile from "../../../component/ProductTile"
import { showNotification } from "../../../component/Toast"
import Title from "../../../component/Ttitle"
import { DataContext } from "../../../context/user"
import SellerAuth from "../../../routes/privateRoutes/seller"
import request from "../../../service/base.service"
import { removeKey } from "../../../utils"

const FavoriteProductPage = () => {
    const { state } = useContext(DataContext)
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [filterObj, setFilterObj] = useState({ productname: '', categoryName: '', productStatus: '', sellerName: '', minPrice: '', maxPrice: '' })
    const [sortObj, setSortObj] = useState('createdAt-DESC')
    const [primaryFilterObj,setPrimaryFilterObj]=useState({primaryFilterName:'FAVORITE'})
    const [overallPage, setOverallpage] = useState<number>(1)
    const [product, setProduct] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getProducts = async () => {
        try {
            const removeFalsy: any = await removeKey(filterObj)
            const payload = {sellerId: state?.auth?.user?._id, page: page,primaryFilterObj:primaryFilterObj, limit: limit, filterObj: removeFalsy, sortObj: sortObj }
            setLoading(true)
            await request({ url: '/api/product/allproduct', method: 'post', data: removeKey(payload) }).then((res: any) => {
                if (res.status === 'success') {
                    setProduct(res?.data)
                    setOverallpage(Math.ceil((res.totalcount / limit)))
                    setLoading(false)
                } else {
                    showNotification(false, res.message)
                }
            })
        } catch (error: any) {
            showNotification(false, error?.data.message)
        }
    }
    useEffect(() => {
        getProducts();
    }, [page, limit, filterObj,sortObj,state?.auth])
    return (
        <>
            <Title title="favorite"/>
            {loading ? <Loader/> :<ProductTile productImage={product} reload={getProducts} label='Your Favorite Product'/>}

        </>
    )
}
export default SellerAuth(FavoriteProductPage)