import * as React from 'react';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { CardContent } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import dummy from '../../assets/dummy.png'
import Image from "next/image";
import { useRouter } from 'next/router';


const ProductTile = ({ productImage }) => {
    const router = useRouter()
    return (
        <>
            <div className='d-flex' style={{ cursor: 'pointer' }}>
                {productImage?.map((item: any, index: number) => (
                    <Card className='col-2 my-2' sx={{ width: 300, height: 250 }}>
                        <div className='d-flex justify-content-end'>
                            <IconButton aria-label="add to favorites">
                                {router.pathname !== '/confirmorder/[addressid]' && <FavoriteIcon style={{ color: item?.fav ? 'red' : '' }} />}
                            </IconButton>
                        </div>
                        <div className='border d-flex justify-content-center' onClick={() => router.push(`/seller/productdetail/${router.pathname === '/confirmorder/[addressid]' ? item?.productDetails?._id : item._id}`)}>
                            <Image src={(item?.images?.[0] ?? item?.productImage[0]) ?? dummy} alt='imgae upload' width='150' height='150' loading="lazy" />
                        </div>
                        <CardContent>
                            <div className='d-flex justify-content-between'>
                                <div >
                                    <span>{(item?.productname ?? item?.productDetails?.productname)}</span>
                                </div>
                                <div >
                                    <span>₹ {item?.price}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>

    );
}
export default ProductTile
