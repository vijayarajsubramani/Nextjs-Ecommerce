import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import Loader from '../../component/Loader';
import ProductTile from '../../component/ProductTile';
import { DataContext } from '../../context/user'
import request from '../../service/base.service';
import styles from './styles.module.css'


export const OrderConfirm = ({ address }) => {
    const router = useRouter();
    const { state } = useContext(DataContext)
    const [paymentMethod, setPaymentMethod] = useState<string>( state?.cart?.payment?.totalamount>25000 ? "ONLINEPAYMENT":"COD")

    const { city, district, name, pincode, mobile } = address ?? {};

    const verifyOrder=()=>{
        const payload={sellerId:state?.auth?.user?._id,addressId:address?._id}
        request({url:'/api/order/order',method:'post',data:payload}).then((res:any)=>{
        })
    }
    return (
        <div>
            {address ? <>
                <div className='d-flex justify-content-center my-3'>
                    <div className='col-6'>
                        <div className={styles.addressCart}>
                            <div className={`${styles.boxRadius} w-50 h-25 py-2 border shadow-sm`}>
                                <p className='card-title'>{name}</p>
                                <p className='card-text'>{mobile}</p>
                                <p className='card-text'>{address?.address}</p>
                                <p className='card-text'>{city}</p>
                                <p className='card-text'>{district}</p>
                                <p className='card-text'>{address?.state} {pincode}</p>
                                <button className='btn btn-secondary rounded-pill m-1' onClick={() => router.push('/deliveryaddress')}>change</button>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.boxRadius} col-4 border p-1 shadow-sm`}>
                        <h4 className='text-info'>Order Summary</h4>
                        <div>
                            <p>Item ({state?.cart?.count}) total : ₹ {state?.cart?.payment?.totalamount}</p>
                        </div>
                        <div className='m-1'>
                            <input type='radio' value="COD" checked={paymentMethod==='COD'}  onChange={(e:any)=>setPaymentMethod(e.target.value)}/>
                            <span className='mx-2'>Cash on Delivery</span>
                        </div>
                        <div className='m-1'>
                            <input type='radio' value="ONLINEPAYMENT" checked={paymentMethod==='ONLINEPAYMENT'} onChange={(e:any)=>setPaymentMethod(e.target.value)}/>
                            <span className='mx-2'> Online Payment</span>
                        </div>
                        <button className='my-3 btn btn-warning rounded-pill' onClick={()=>verifyOrder()}>Submit your order to Pay</button>
                    </div>
                </div>
                <hr />
                <div className='d-flex justify-content-center'>
                    <ProductTile productImage={state?.cart?.cartdata} />
                </div>
            </> : <Loader />}
        </div>
    )
}
