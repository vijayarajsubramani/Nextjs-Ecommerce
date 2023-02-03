import { useRouter } from "next/router";
import LoginIcon from '@mui/icons-material/Login';
import styles from './header.module.css'
import { useContext } from "react";
import { DataContext } from "../../context/user";
import CartIcon from "../../component/CartIcon";
import BasicMenu from "../../component/Menu";




const Header = () => {
    const router = useRouter()
    const { state } = useContext(DataContext)
    return (
        <>
            <header className={`${styles.header} container-fluid`}>
                <div className="row">
                    <div className="col">
                        <h3 className="py-2" onClick={() => router.push('/')}>Vj</h3>
                    </div>
                    <div className="col d-flex flex-row-reverse" >
                        {!state?.auth?.user?.role ? <div className="p-2"><LoginIcon onClick={() => router.push('/login')} /></div> :
                            <div className="d-flex p-2">
                                {state?.auth?.user?.role.includes('SELLER') && <CartIcon />}
                                <div className="m-1">
                                    <BasicMenu />
                                </div>
                            </div>}
                    </div>
                </div>
            </header>
        </>

    )
}
export default Header