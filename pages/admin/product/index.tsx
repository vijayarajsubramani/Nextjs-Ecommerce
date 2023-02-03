import ProductAdmin from "../../../container/admin/product"
import AdminAuth from "../../../routes/privateRoutes/admin"

const Product = () => {
    return (
        <>
           <ProductAdmin/>
        </>
    )
}
export default AdminAuth(Product)