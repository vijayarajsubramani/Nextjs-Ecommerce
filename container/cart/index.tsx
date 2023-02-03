import Link from "next/link";
import { decrease, deleteCart, increase } from "../../context/user/action";

interface Tprops {
    cart?: any,
    dispatch?: any,
    state?: any
}
const Cart: React.FC<Tprops> = ({ cart, state, dispatch }) => {
    return (
        <>
            <tr>
                <td style={{ width: '100px', overflow: 'hidden' }}>
                    <Link href={`/seller/productdetail/${cart.productDetails?._id}`}>
                        <img src={cart.productImage[0]} alt={cart.productImage[0]} className="img-thumbnail w-100" style={{ minWidth: '80px', height: '80px', cursor: 'pointer' }} />
                    </Link>
                </td>
                <td style={{ minWidth: '200px' }} className="w-50 align-middle" >
                    <h5 className="text-capitalize">
                        <Link href={`/seller/productdetail/${cart.productDetails?._id}`} legacyBehavior>
                            <a style={{ textDecoration: 'none', color: 'inherit' }}>{cart.productDetails?.productname}</a>
                        </Link>
                    </h5>
                    <h6 style={{ color: '#f582ae' }}>₹ {cart?.price}</h6>
                    {cart.quantity > 0 ? <p className="mb-1 text-info">In Stock: {cart?.productDetails?.quantity}</p> : <p className="mb-1 text-danger">Out Stock</p>}
                </td>

                <td className="align-middle" style={{ minWidth: '150px' }}>
                    <button className="btn btn-outline-secondary" onClick={() => decrease(cart, state?.auth, dispatch, 'dec')} disabled={cart.quantity === 1 ? true : false}> - </button>
                    <span className="px-3">{cart.quantity}</span>
                    <button className="btn btn-outline-secondary" onClick={() => increase(cart, state?.auth, dispatch, 'inc')} disabled={cart.quantity === cart?.productDetails?.quantity ? true : false}> + </button>
                </td>
                <td className="align-middle" style={{ minWidth: '50px', cursor: 'pointer' }}>
                    <i className="far fa-trash-alt text-danger" aria-hidden="true" style={{ fontSize: '18px' }} data-toggle="modal" data-target="#exampleModal" onClick={() => deleteCart(cart, state.auth, dispatch)}></i>
                </td>
            </tr>
        </>
    )
}
export default Cart