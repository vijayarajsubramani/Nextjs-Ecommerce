import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from "next/image";
import dummy from '../../assets/dummy.png'
import { useRouter } from 'next/router';

const ProductTitle = ({ productImage }) => {
    const router = useRouter();

    return (
        <>
            <div className='d-flex my-3'>
                {productImage?.map((item, index) => (
                    <Card sx={{ width: 300, heigth: 300 }} className='m-2' >
                        <div key={index} style={{ cursor: 'pointer' }}>
                            <div className='d-flex justify-content-end' >
                                <IconButton aria-label="add to favorites">
                                    {router.pathname !== '/confirmorder/[addressid]' && <FavoriteIcon />}
                                </IconButton>
                            </div>
                            <CardContent onClick={() => router.push(`/seller/productdetail/${router.pathname === '/confirmorder/[addressid]' ? item?.productDetails?._id : item._id}`)}>
                                <div className='row border d-flex justify-content-center' >
                                    <Image src={(item?.images?.[0] ?? item?.productDetails?.images[0]) ?? dummy} alt='imgae upload' width='175' height='175' loading="lazy" />
                                </div>
                                <div className='d-flex justify-content-between m-1' >
                                    <div >
                                        <span>{(item?.productname ?? item?.productDetails?.productname) || ''}</span>
                                    </div>
                                    <div >
                                        <span>₹ {item.price || ''}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardActions disableSpacing>
                            </CardActions>
                        </div>
                    </Card>

                ))}
            </div>
        </>
    );
}
export default ProductTitle