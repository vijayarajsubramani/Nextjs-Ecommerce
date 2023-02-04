import Image from "next/image";
import dummy from '../../assets/dummy.png'
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/user";
import styles from './styles.module.css'
import DoneIcon from "@mui/icons-material/Done";
import { addTocart, addToFav, decrease, increase, removeToFav } from "../../context/user/action";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
interface Tprops {
    product?: any,
    reload?: any
}
const ProductDetail: React.FC<Tprops> = ({ product, reload }) => {
    const router = useRouter();
    const id = router.query.id
    const { state, dispatch } = useContext(DataContext)
    const { productname, quantity, images, price, description, sellerDetails: { name = '' } = {} } = product ?? {}
    const [toggleImage, setToggleImage] = useState<string>()
    const [cartQuantity, setCartQuantity] = useState<number>(1)

    const changeImage = (url: string) => setToggleImage(url)

    useEffect(() => {
        const find = state?.cart?.cartdata?.find((item: any) => item?.productDetails?._id === id)
        if (find?.quantity) setCartQuantity(find?.quantity)
    }, [state.cart])

    return (
        <>
            <div>
                <div className="row m-4">
                    <div className="col-5" style={{ cursor: 'pointer' }}>
                        <div className='d-flex justify-content-end' >
                            <IconButton aria-label="add to favorites" onClick={() => product?.favoritesCount === 0 ? addToFav(product, state?.auth?.user?._id, reload) : removeToFav(product, state?.auth?.user?._id, reload)}>
                                <FavoriteIcon style={{ color: product?.favoritesCount === 1 ? 'red' : '' }} />
                            </IconButton>
                        </div>
                        <div className="row">
                            <Image src={toggleImage ?? images?.[0]} alt='imgae upload' width='500' height='300' loading="lazy" onClick={() => changeImage(images?.[0])} />
                        </div>
                        <div className="row">
                            <Image src={images?.[1] ?? dummy} alt='imgae upload' width='120' height='120' loading="lazy" onClick={() => changeImage(images?.[1])} />
                            <Image src={images?.[2] ?? dummy} alt='imgae upload' width='120' height='120' loading="lazy" onClick={() => changeImage(images?.[2])} />
                            <Image src={images?.[3] ?? dummy} alt='imgae upload' width='120' height='120' loading="lazy" onClick={() => changeImage(images?.[3])} />
                            <Image src={images?.[4] ?? dummy} alt='imgae upload' width='120' height='120' loading="lazy" onClick={() => changeImage(images?.[4])} />
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <h6>Seller Name: {name}</h6>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="h1">{(productname) ?? '-'}</p>
                            <div className={styles.stock}>
                                {quantity && <><DoneIcon /><span>In stock</span> </>}
                            </div>
                        </div>
                        <p className="h5">₹ {price ?? '-'} </p>
                        <div className="align-middle " style={{ minWidth: '150px' }}>
                            <button className="btn btn-outline-secondary" onClick={() => decrease(product, state?.auth, dispatch, 'dec')} > - </button>
                            <span className="px-3 text-center">{cartQuantity}</span>
                            <button className="btn btn-outline-secondary" onClick={() => increase(product, state?.auth, dispatch, 'inc')} > + </button>
                            <button className="col-3 btn btn-warning rounded-pill m-1" onClick={() => addTocart(product, state?.auth, dispatch, '1')}>Add to Cart</button>
                        </div>

                        <div className={styles.product_description}>
                            <h6>Descriptions</h6>
                            <p>{description ?? '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )

}
export default ProductDetail