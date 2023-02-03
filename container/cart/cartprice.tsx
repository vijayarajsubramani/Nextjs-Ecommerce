import Link from "next/link"
import { useRouter } from "next/router"

const CartPrice = ({state,total,subTotal,shippingfess}) => {
    const router = useRouter()
    const handleCheckout=()=>{
        router.push('/deliveryaddress')
    }
    return (
        <>
            <div className="col-md-4 my-3 text-right text-uppercase">
                <h5 className='pt-4'>Your Order Total</h5>
                <h6>subTotal: <span className="text-info">₹ {subTotal}</span></h6>
                <h6>Shipping Fee (free for orders over ₹ 500): <span className="text-danger">₹ {subTotal > 500 ? 'Free' : shippingfess}</span></h6>
                <h6>Total: <span className="text-danger">₹ {total}</span></h6>
                <a className="slide btn d-block my-3 px-5" style={{ background: '#8bd3dd' }} data-hover='Proceed with Payment' onClick={()=>handleCheckout()}><div>Processed to checkout</div></a>
            </div>
        </>
    )
}
export default CartPrice