import Sidebar from "../../../component/Sidebar"
import Title from "../../../component/Ttitle"
import SellerAuth from "../../../routes/privateRoutes/seller"


const OrderDetail = () => {
    return (
        <>
            <Title title="order"/>
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