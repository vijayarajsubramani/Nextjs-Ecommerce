import Sidebar from "../../../component/Sidebar"
import SellerAuth from "../../../routes/privateRoutes/seller"


const OrderDetail = () => {
    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                        <p>OrderDetail Page</p>
                </div>
            </div>
        </>
    )
}
export default SellerAuth(OrderDetail)