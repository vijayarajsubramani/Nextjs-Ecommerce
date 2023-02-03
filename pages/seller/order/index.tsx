import Sidebar from "../../../component/Sidebar"
import SellerAuth from "../../../routes/privateRoutes/seller"


const Order = () => {

    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                        <p>Order Page</p>
                </div>
            </div>
        </>
    )
}
export default SellerAuth(Order)