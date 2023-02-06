import { useRouter } from "next/router"
import AddressCard from "../../component/Addresscard"
import PaymentProgress from "../../component/Paymentprogress"
import Title from "../../component/Ttitle"
import SellerAuth from "../../routes/privateRoutes/seller"


const Address = () => {
    const router = useRouter()
    return (
        <>
            <Title title="delivery-address"/>
            <div className="d-flex justify-content-between">
                <div className="mt-4 mb-4 col-1">
                    <button className="btn btn-info" onClick={() => router.back()}>
                        <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go Back
                    </button>
                </div>
                <div className="col-6 mt-4 mb-4">
                    <PaymentProgress val={1} />
                </div>
            </div>
            <div style={{ float: 'left' }}>
                <AddressCard />
            </div>
        </>
    )
}
export default SellerAuth(Address)