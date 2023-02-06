import { useContext } from "react"
import Sidebar from "../../component/Sidebar"
import Title from "../../component/Ttitle"
import Addproduct from "../../container/addProduct"
import { DataContext } from "../../context/user"
import SellerAuth from "../../routes/privateRoutes/seller"
const SellerProduct = () => {
    const { state } = useContext(DataContext)
    return (
        <>
            <Title title="Add-product"/>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <h4>Create New Product</h4>
                    <Addproduct user={state?.auth?.user}/>
                </div>
            </div>
        </>
    )
}
export default SellerAuth(SellerProduct)