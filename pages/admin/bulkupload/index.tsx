import Sidebar from "../../../component/Sidebar"
import Title from "../../../component/Ttitle"
import AdminbulkUploadProduct from "../../../container/admin/bulkupload"
import AdminAuth from "../../../routes/privateRoutes/admin"

const AdminbulkUploadPage = () => {
    return (
        <>
          <Title title="Admin bulkupload"/>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <h4>Bulk-upload</h4>
                    <AdminbulkUploadProduct/>
                </div>
            </div>
        </>
    )
}
export default AdminAuth(AdminbulkUploadPage)