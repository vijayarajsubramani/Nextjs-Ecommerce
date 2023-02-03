import AddressCard from "../../../component/Addresscard"
import Sidebar from "../../../component/Sidebar"
import SellerAuth from "../../../routes/privateRoutes/seller"


const Address = () => {

    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div >
                        <AddressCard/>
                </div>
            </div>
        </>
    )
}
export default SellerAuth(Address)