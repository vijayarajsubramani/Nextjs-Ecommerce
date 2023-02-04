import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import PaymentProgress from "../../component/Paymentprogress"
import { showNotification } from "../../component/Toast"
import { OrderConfirm } from "../../container/orderconfirm"
import { DataContext } from "../../context/user"
import HeaderRoute from "../../routes/HeaderRoutes"
import SellerAuth from "../../routes/privateRoutes/seller"
import request from "../../service/base.service"

const OrderConfirmPage = () => {
    const router = useRouter();
    const addId = router.query.addressid
    const { state } = useContext(DataContext)
    const [address, setAddress] = useState([])
    const getbyAddress = () => {
        try {
            if (addId) {
                request({ url: '/api/address/get', method: 'patch', data: { buyerId: state?.auth?.user?._id, addressId: addId } }).then((res: any) => {
                    if (res.status === 'success') {
                        setAddress(res?.data)
                    }
                })
            }
        } catch (err: any) {
            showNotification(false, err)
        }
    }
    useEffect(() => {
        getbyAddress()
    }, [state.auth, addId])
    return (
        <>
            <div className="d-flex justify-content-between">
                <div className="mt-4 mb-4 col-1">
                    <button className="btn btn-info" onClick={() => router.back()}>
                        <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go Back
                    </button>
                </div>
                <div className="col-6 mt-4 mb-4">
                    <PaymentProgress val={2} />
                </div>
            </div>
            <div className="text-center my-5">
                <h4>Please confirm and submit your order</h4>
                <div>
                    <OrderConfirm address={address}/>
                </div>
            </div>
        </>
    )
}
export default HeaderRoute(OrderConfirmPage)