import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { showNotification } from "../../../component/Toast"
import MoreFromSellerProduct from "../../../container/more-seller-product"
import ProductDetail from "../../../container/productDetail"
import RecentlyViewProduct from "../../../container/recently-view-product"
import { DataContext } from "../../../context/user"
import HeaderRoute from "../../../routes/HeaderRoutes"
import request from "../../../service/base.service"

const ProductDetailPage = () => {
    const router = useRouter();
    const { state } = useContext(DataContext)
    const id = router?.query?.id;
    const [product, setProduct] = useState<any>([])
    const getProductbyId = () => {
        request({ url: `/api/product/${id}`, method: 'get' }).then((res: any) => {
            setProduct(res?.data[0])
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }
    useEffect(() => {
        if (id) getProductbyId()
    }, [id])
    return (
        <>
            <div className="sideeMenu">
                <div className="mt-4 mb-4 col-1">
                    <button className="btn btn-info" onClick={() => router.back()}>
                        <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go Back
                    </button>
                </div>
                <div className="mainsection">
                    <ProductDetail product={product}  reload={getProductbyId}/>
                    <div className="my-5">
                        <MoreFromSellerProduct sellerId={product?.sellerDetails?._id} />
                    </div>
                    <div className="my-5">
                        {state?.auth?.user && <RecentlyViewProduct />}
                    </div>
                </div>
            </div>
        </>
    )
}
export default HeaderRoute(ProductDetailPage)