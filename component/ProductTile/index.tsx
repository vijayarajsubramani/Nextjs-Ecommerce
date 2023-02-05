import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from "next/image";
import dummy from '../../assets/dummy.png'
import { useRouter } from 'next/router';
import { addToFav, removeToFav } from '../../context/user/action';
import { DataContext } from '../../context/user';


interface Tprops {
    productImage?: any,
    label?: string,
    reload?:any
}
const ProductTitle: React.FC<Tprops> = ({ productImage, label ,reload}) => {
    const {state}=React.useContext(DataContext)
    const router = useRouter();
    return (
        <>
            <h5>{label}</h5>
            <div style={{ width: '99%', height: '200px' }} className='d-flex m-2 row'>
                {productImage?.map((item, index) => (
                    <Card sx={{ width: 300, heigth: 300 }} className='m-2 ' >
                        <div key={index} style={{ cursor: 'pointer' }}>
                            <div className='d-flex justify-content-end'>

                            </div>
                            <CardContent >
                                <div className='row border d-flex justify-content-center' onClick={() => router.push(`/seller/productdetail/${router.pathname === '/confirmorder/[addressid]' ? item?.productDetails?._id : item._id}`)}>
                                    <Image src={(item?.images?.[0] ?? item?.productDetails?.images[0]) ?? dummy} alt='imgae upload' width='175' height='175' loading="lazy" />
                                </div>
                                <div className='d-flex justify-content-between m-1' >
                                    <div >
                                        <span>{(item?.productname ?? item?.productDetails?.productname) || ''}</span>
                                    </div>
                                    <div >
                                        <span>₹ {item.price || ''}</span>
                                    </div>
                                    {state?.auth?.user && <IconButton aria-label="add to favorites" onClick={() => item?.favoritesCount === 0 ? addToFav(item, state?.auth?.user?._id, reload) : removeToFav(item, state?.auth?.user?._id, reload)}>
                                        {router.pathname !== '/confirmorder/[addressid]' &&<FavoriteIcon style={{ color: item?.favoritesCount === 1 ? 'red' : '' }} />}
                                    </IconButton>}
                                </div>
                            </CardContent>
                        </div>
                    </Card>

                ))}
            </div>
        </>
    );
}
export default ProductTitle