import Footer from "../../container/footer";
import Header from "../../container/header";

const AdminAuth = (WrappedComponent: any) => {
    return (props: any) => {
        return <><Header /><WrappedComponent {...props} /><Footer /></>
    }
}
export default AdminAuth