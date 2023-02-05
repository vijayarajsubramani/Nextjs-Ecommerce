import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import ProductTile from '../../component/ProductTile'
import { showNotification } from '../../component/Toast'
import { DataContext } from '../../context/user'
import request from '../../service/base.service'
import { removeKey } from '../../utils'

const RecentlyViewProduct = () => {
    const router = useRouter();
    const { state } = useContext(DataContext)
    const id = router?.query?.id;
    const [searchValue, setsearchvalue] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(4)
    const [filterObj, setFilterObj] = useState({ productname: '', categoryName: '', productStatus: '', sellerName: '', minPrice: '', maxPrice: '' })
    const [sortObj, setSortObj] = useState('createdAt-DESC')
    const [primaryFilterObj, setPrimaryFilterObj] = useState({ primaryFilterName: 'RECENTLY' })
    const [overallPage, setOverallpage] = useState<number>(1)
    const [product, setProduct] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getProducts = async () => {
        try {
            const removeFalsy: any = await removeKey(filterObj)
            const payload = { sellerId: state?.auth?.user?._id, page: page, limit: limit, primaryFilterObj: primaryFilterObj, searchValue: searchValue, filterObj: removeFalsy, sortObj: sortObj }
            setLoading(true)
            await request({ url: `/api/product/${id}`, method: 'post', data: removeKey(payload) }).then((res: any) => {
                if (res.status === 'success') {
                    setProduct(res?.data)
                    setOverallpage(Math.ceil((res.totalcount / limit)))
                    setLoading(false)
                } else {
                    // showNotification(false, res.message)
                }
            })
        } catch (error: any) {
            showNotification(false, error?.data.message)
        }
    }
    useEffect(() => {
        id && getProducts();
    }, [page, limit, filterObj, id, state?.auth])
    return (
        <>
            <div>
                <ProductTile productImage={product} label='Recently View Product' reload={getProducts}/>
            </div>
        </>
    )
}
export default RecentlyViewProduct
