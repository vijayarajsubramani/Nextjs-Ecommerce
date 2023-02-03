import { useEffect, useState } from 'react';
import ProductTile from '../../component/ProductTile';
import { showNotification } from '../../component/Toast';
import GuestAuth from '../../routes/publicRoutes';
import request from '../../service/base.service';
import { removeKey } from '../../utils';

const HomePage = () => {
    const [searchValue, setsearchvalue] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(5)
    const [filterObj, setFilterObj] = useState({ productname: '', categoryName: '', productStatus: '', sellerName: '', minPrice: '', maxPrice: '' })
    const [sortObj, setSortObj] = useState('createdAt-DESC')
    const [overallPage, setOverallpage] = useState<number>(1)
    const [product, setProduct] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getProducts = async () => {
        try {
            const removeFalsy: any = await removeKey(filterObj)
            const payload = { page: page, limit: limit, searchValue: searchValue, filterObj: removeFalsy, sortObj: sortObj }
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
    }, [page, limit, filterObj])

    return (
        <>
            <ProductTile productImage={product} />
        </>
    )
}
export default GuestAuth(HomePage);

