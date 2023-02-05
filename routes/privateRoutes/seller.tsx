import { useRouter } from "next/router";
import { useContext } from "react";
import Footer from "../../container/footer";
import Header from "../../container/header";
import { DataContext } from "../../context/user";

const AdminAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const {state}=useContext(DataContext)
        const router = useRouter();
        if(typeof window !=='undefined'){
            if (!(state?.auth?.user?.role.includes('SELLER'))) {
                router.replace("/");
                return null; 
              }
        
        return <><Header /><WrappedComponent {...props} /><Footer /></>
    }
        return null
    }
}
export default AdminAuth