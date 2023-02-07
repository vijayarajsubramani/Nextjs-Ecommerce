import { useContext, useEffect, useState } from 'react'
import Link from "next/link";
import { useRouter } from "next/router";
import styles from './styles.module.css'
import request from '../../service/base.service';
import { DataContext } from '../../context/user';


const Sidebar = () => {
    const router = useRouter()
    const { state,dispatch } = useContext(DataContext)
    const [sidemenuTitle, setSidemenuTitle] = useState('')
    const [sidemenu, setSidemenu] = useState<any[]>([])
    const currentUrl = router.pathname;

    const adminMenu = [
        { name: "User", url: "/admin/user", disabled: false },
        { name: "Product", url: "/admin/product", disabled: false },
        { name: "Bulkupload", url: "/admin/bulkupload", disabled: false },
        { name: "Category", url: "/admin/category", disabled: false }
    ]
    const sellerMenu = [
        { name: "Product", url: "/seller/productlist", disabled: false },
        { name: "Address", url: "/seller/address", disabled: false },
    ]

    const handleOnSidemenu = () => {
        if (state.auth?.user?.role?.includes('SELLER')) {
            setSidemenuTitle('Seller Manager')
            setSidemenu(sellerMenu)
        }
        if (state.auth?.user?.role?.includes('ADMIN')) {
            setSidemenuTitle('Admin Manager')
            setSidemenu(adminMenu)
        }
    }
    useEffect(() => {
        handleOnSidemenu()
    }, [state?.auth?.user])
    return (
        <>

            <div className={`${styles.sideeMenu} sellerSidemenu`} >
                <div className={styles.textS}>
                    <div className={styles.dropdown}>
                        <h5>{sidemenuTitle}</h5>
                    </div>
                </div>
                {sidemenu?.length > 0 ? <nav className={styles.nav}>
                    {sidemenu?.map((data, index: number) =>
                        <Link href={`${data?.disabled ? "#" : data.url}`} key={index} legacyBehavior>
                            <a className={data.url === currentUrl ? styles.active : styles.inActive} style={data?.disabled ? { opacity: "0.5" } : { opacity: "1" }} >
                                <span className={styles.SideLink}>{data?.name}</span>
                            </a>
                        </Link>
                    )}
                </nav> : <></>}
            </div>
        </>
    )
}
export default Sidebar