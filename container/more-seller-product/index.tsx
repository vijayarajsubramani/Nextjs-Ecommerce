import React, { useEffect, useState } from 'react'
import ProductTile from '../../component/ProductTile'
import { showNotification } from '../../component/Toast'
import request from '../../service/base.service'
import { removeKey } from '../../utils'

const MoreFromSellerProduct = ({sellerId}) => {
    const [searchValue, setsearchvalue] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(5)
    const [primaryFilterObj,setPrimaryFilterObj]=useState({primaryFilterName:'SELLER_PRODUCT'})
    const [filterObj, setFilterObj] = useState({ productname: '', categoryName: '', productStatus: '', sellerName: '', minPrice: '', maxPrice: '' })
    const [sortObj, setSortObj] = useState('createdAt-DESC')
    const [overallPage, setOverallpage] = useState<number>(1)
    const [product, setProduct] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getProducts = async () => {
        try {
            const removefalsyFilterObj: any = await removeKey(filterObj)
            const payload = {sellerId:sellerId,primaryFilterObj:primaryFilterObj, page: page, limit: limit, searchValue: searchValue, filterObj: removefalsyFilterObj, sortObj: sortObj }
            console.log('payload',payload)
            setLoading(true)
            await request({ url: '/api/product/allsellerproduct', method: 'post', data: removeKey(payload) }).then((res: any) => {
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
    }, [page, limit, filterObj,sellerId])
    return (
        <>
           <h5>More from this Seller</h5> 
           <ProductTile productImage={product}/>
         </>
    )
}
export default MoreFromSellerProduct
