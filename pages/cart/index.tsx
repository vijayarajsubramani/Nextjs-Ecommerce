import Sidebar from "../../component/Sidebar"
import SellerAuth from "../../routes/privateRoutes/seller"
import Cart from "../../container/cart";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/user";
import CartPrice from "../../container/cart/cartprice";
import { useRouter } from "next/router";

const CartPage = () => {
    const router=useRouter()
    const { state, dispatch } = useContext(DataContext)
    const [shippingfess, setShippingfees] = useState<number>(40)
    const [subTotal, setSubTotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const getTotal = () => {
        const res = state.cart?.cartdata?.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0)
        setSubTotal(res)
        res > 500 ? setTotal(res) : setTotal(shippingfess + res)
    }
 
    useEffect(() => {
        getTotal()
    }, [state.cart])

    return (
        <>
            <div className="sideeMenu">
                <Sidebar />
                <div className="mainsection">
                    <div className="mt-4 mb-4">
                        <button className="btn btn-info" onClick={() => router.back()}>
                            <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go Back
                        </button>
                    </div>
                    {state?.cart?.cartdata?.length === 0 ? <div className="col-md-5 p-lg-4 mx-auto my-1">
                        <p>Your Shopping Cart Is emtyCart, Add Your Favorite Products and Continue Shopping!</p>
                    </div> :
                        <div className='row'>
                            <div className="col-md-8 table-responsive my-3">
                                <h4 className="text-uppercase">Shopping Cart</h4>
                                <table className="table my-3">
                                    <tbody>
                                        {state?.cart?.cartdata?.map((item: any) => (<Cart key={item._id} cart={item} state={state} dispatch={dispatch} />))}
                                    </tbody>
                                </table>
                            </div>
                            <CartPrice total={total} subTotal={subTotal} shippingfess={shippingfess} state={state} />
                        </div>}
                </div>
            </div>
        </>
    )
}
export default SellerAuth(CartPage)