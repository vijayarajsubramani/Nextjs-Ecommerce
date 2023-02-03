import styles from './styles.module.css'
import Image from "next/image";
import dummy from '../../assets/dummy.png'
import { useRouter } from 'next/router';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit'
import Pagination from '../Pagination';

interface Tprops {
    data?: any,
    pagination?: (e, data) => void,
    overallPage?: any
}
const ProductItem: React.FC<Tprops> = ({ data, pagination, overallPage }) => {
    const router = useRouter()
    const editProduct = (id: string) => {
        router.push(`/seller/productlist/${id}`)
    }
    const viewProduct = (id: string) => {
        router.push(`/seller/productdetail/${id}`)
    }
    return (
        <>

            <div className={styles.row}>
                {data?.map((item: any, index: number) => (
                    <div className={styles.column} key={index} onClick={() => viewProduct(item?._id)} >
                        <div className={styles.card} >
                            <Image src={item?.images[0] ?? dummy} alt='imgae upload' width='175' height='175' loading="lazy"/>
                            <div className={styles.productname}>
                                <div >
                                    <h6>Product Name</h6>
                                    <span>{item?.productname || ''}</span>
                                </div>
                                <div >
                                    <h6>Seller Name</h6>
                                    <span>{item?.sellerDetails?.name || ''}</span>
                                </div>
                            </div>
                            <div className={styles.icons}>
                                <PreviewIcon onClick={() => viewProduct(item?._id)} />
                                <EditIcon onClick={() => editProduct(item?._id)} />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            <div className='d-flex flex-row-reverse'>
                {data.length > 0 && <Pagination page={overallPage} variant='outlined' shape='rounded' pagination={(e: any, data: any) => { pagination && pagination(e, data) }} />}
            </div>
        </>
    )
}
export default ProductItem