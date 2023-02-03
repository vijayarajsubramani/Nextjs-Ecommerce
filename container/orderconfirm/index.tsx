import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import Loader from '../../component/Loader';
import ProductTile from '../../component/ProductTile';
import { DataContext } from '../../context/user'
import styles from './styles.module.css'


export const OrderConfirm = ({ address }) => {
    const router = useRouter();
    const { state } = useContext(DataContext)
    const { city, district, name, pincode, mobile } = address ?? {}
    return (
        <div>
            {address ? <>
                <div className='row d-flex justify-content-around'>
                    <div className='col-6 border'>
                        {/* <div className="row d-flex justify-content-end"> */}
                        <div className={styles.addressCart}>
                            <div className='border'>
                                <p className='card-title'>{name}</p>
                                <p className='card-text'>{mobile}</p>
                                <p className='card-text'>{address?.address}</p>
                                <p className='card-text'>{city}</p>
                                <p className='card-text'>{district}</p>
                                <p className='card-text'>{address?.state}</p>
                                <p className='card-text'>{pincode}</p>
                                <button onClick={() => router.push('/deliveryaddress')}>change</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-4 border'>
                        <h4>Order Summary</h4>
                        <p>Item total : ₹ 11196</p>
                        {/* <p>Order total ({state?.cart?.cartdata.length} items) :₹ 11196</p> */}
                        <input type='checkbox' />Apply coupon code
                        <input type='radio' /> Cash on Delivery
                        <input type='radio' /> Online Payment
                        <button>Submit your order to Pay</button>
                    </div>
                </div>
                <div>
                    <ProductTile productImage={state?.cart?.cartdata} />
                </div>
            </> : <Loader />}
        </div>
    )
}
