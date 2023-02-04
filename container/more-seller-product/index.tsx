import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ProductTile from '../../component/ProductTile'
import { showNotification } from '../../component/Toast'
import request from '../../service/base.service'
import { removeKey } from '../../utils'

const MoreFromSellerProduct = ({sellerId}) => {
    const router = useRouter();
    const id = router?.query?.id;
    const [searchValue, setsearchvalue] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(4)
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
            setLoading(true)
            await request({ url: `/api/product/${id}`, method: 'post', data: removeKey(payload) }).then((res: any) => {
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
        id && getProducts();
    }, [page, limit, filterObj,sellerId,id])
    return (
        <> 

          {product.length>0 && <><h5></h5> <ProductTile productImage={product} label='More from this Seller'/> </>}
         </>
    )
}
export default MoreFromSellerProduct
