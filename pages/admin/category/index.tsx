import Sidebar from '../../../component/Sidebar'
import Category from '../../../container/admin/category'
import AdminAuth from "../../../routes/privateRoutes/admin"

const CategoryPage = () => {
    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <h4>Category</h4>
                    <Category />
                </div>
            </div>
        </>
    )
}
export default AdminAuth(CategoryPage)