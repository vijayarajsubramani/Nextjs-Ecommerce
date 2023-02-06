import Title from "../../../component/Ttitle"
import ProductAdmin from "../../../container/admin/product"
import AdminAuth from "../../../routes/privateRoutes/admin"

const Product = () => {
    return (
        <>  
        <Title title="Admin Product"/>
           <ProductAdmin/>
        </>
    )
}
export default AdminAuth(Product)