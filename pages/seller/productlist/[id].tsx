import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Sidebar from "../../../component/Sidebar"
import { showNotification } from "../../../component/Toast"
import Addproduct from "../../../container/addProduct"
import { DataContext } from "../../../context/user"
import SellerAuth from "../../../routes/privateRoutes/seller"
import request from "../../../service/base.service"

const ProductEdit = () => {
    const router = useRouter();
    const { state } = useContext(DataContext)
    const id = router?.query?.id;
    const [product, setProduct] = useState<any>([])
    const getProductbyId = () => {
        request({ url: `/api/product/${id}`, method: 'get' }).then((res: any) => {
            setProduct(res?.data[0])
        }).catch((err:any)=>{
            showNotification(false, err.data.message)
        })
    }
    useEffect(() => {
        if (id) getProductbyId()
    }, [id])
    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <h4>Product-Edit</h4>
                    <Addproduct product={product} user={state?.auth?.user}/>
                </div>
            </div>
        </>
    )
}
export default SellerAuth(ProductEdit)