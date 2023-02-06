import Sidebar from "../../../component/Sidebar"
import Title from "../../../component/Ttitle"
import AllUser from "../../../container/admin/user"
import AdminAuth from "../../../routes/privateRoutes/admin"

const User = () => {
    return (
        <>
            <Title title="Admin user"/>
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