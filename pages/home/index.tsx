import { useEffect, useState } from 'react';
import Loader from '../../component/Loader';
import ProductFilter from '../../component/ProductFilter';
import ProductTile from '../../component/ProductTile';
import { showNotification } from '../../component/Toast';
import Title from '../../component/Ttitle';
import HeaderRoute from '../../routes/HeaderRoutes';
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
    const handleLoadmore = () => setPage(page + 1)
    useEffect(() => {
        getProducts();
    }, [page, limit, filterObj, searchValue, sortObj])

    return (
        <>
            <Title title="Unipick" />
            <ProductFilter setsearchvalue={setsearchvalue} setSortObj={setSortObj} setFilterObj={setFilterObj} />
            {loading ? <Loader /> : <ProductTile productImage={product} reload={getProducts} />}
            {product.length < page * 5 ? "" :
                <div className='fixed-bottom d-flex justify-content-center'>
                    <button className="btn btn-info my-2" onClick={handleLoadmore}>Load More</button>
                </div>
            }
        </>
    )
}
export default HeaderRoute(HomePage);

