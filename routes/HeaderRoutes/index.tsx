import { useContext } from "react";
import Footer from "../../container/footer";
import Header from "../../container/header";
import { DataContext } from "../../context/user";

const HeaderRoute = (WrappedComponent: any) => {
    return (props: any) => {
        const { state } = useContext(DataContext)
            return <><Header /><WrappedComponent {...props} /></>
    }
}
export default HeaderRoute