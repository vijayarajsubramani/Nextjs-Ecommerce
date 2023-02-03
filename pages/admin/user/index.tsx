import Sidebar from "../../../component/Sidebar"
import AllUser from "../../../container/admin/user"
import AdminAuth from "../../../routes/privateRoutes/admin"

const User = () => {
    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <h4>Users</h4>
                    <AllUser />
                </div>
            </div>
        </>
    )
}
export default AdminAuth(User)