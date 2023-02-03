import Footer from "../../container/footer";
import Header from "../../container/header";

const GuestAuth=(WrappedComponent:any)=>{
    return(props:any)=>{
        return <><Header/><WrappedComponent {...props}/><Footer/></>
    }
}
export default GuestAuth