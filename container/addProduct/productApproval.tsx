import { useRouter } from "next/router"
import { useContext } from "react"
import { showNotification } from "../../component/Toast"
import { DataContext } from "../../context/user"
import request from "../../service/base.service"
import styles from './styles.module.css'

interface Tprops {
    product?: any
}
const ProductApproval: React.FC<Tprops> = ({ product }) => {
    const router = useRouter()
    const { state } = useContext(DataContext)
    const id = router.query.id
    const productApprove = async (status: string) => {
        await request({ url: `/api/product/${id}`, method: 'put', data: { productStatus: status } }).then((res: any) => {
            if (res.status === 'success') {
                showNotification(true, res.message)
                router.push('/admin/product')
            }
        }).catch((err: any) => {
            showNotification(false, err.data.message)
        })
    }
    return (
        <>
            {state?.auth?.user?.role.includes('ADMIN') &&<div>
                {product?.productStatus !== 'APPROVED' && <button className='btn btn-success' onClick={() => productApprove('APPROVED')}>Accept</button>}
                {product?.productStatus !== 'REJECTED' && <button className='btn btn-danger mx-1' onClick={() => productApprove('REJECTED')}>Reject</button>}
            </div>}
        </>
    )
}
export default ProductApproval