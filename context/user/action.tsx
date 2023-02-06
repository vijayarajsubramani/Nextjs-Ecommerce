import { showNotification } from "../../component/Toast"
import request from "../../service/base.service"

export const ACTIONS = {
    AUTH: 'AUTH',
    ADD_CART: 'ADD_CART'
}
export const addTocart = async (data: any, user: any, dispatch: any, incdec: string) => {
    console.log('data', data)
    try {
        const payload = {
            buyerId: user?.user?._id, 
            productId: data?._id, 
            productname: data?.productname ?? data?.productDetails?.productname,
            productImage: data?.images ?? data?.productDetails?.productImage,
            quantity: +incdec,
            price: data?.price ?? data?.productDetails?.price
        }
        if (incdec === 'inc' || incdec === 'dec') payload.productId = data?.productDetails?._id ?? data?._id;
        if (incdec === 'inc') payload.quantity = 1;
        if (incdec === 'dec') payload.quantity = - 1;
        console.log('payload',payload)
        await request({ url: '/api/cart/cart', method: 'post', data: payload }).then((async (res: any) => {
            if (res.status === 'success') {
                await getAlladdTocart(user, dispatch)
            }
        })).catch((err: any) => {
            showNotification(false, err?.data?.message)
        })
    } catch (err: any) {
        showNotification(false, err?.data?.message)
    }
}
const getAlladdTocart = async (user: any, dispatch: any) => {
    await request({ url: '/api/cart/cart', method: 'patch', data: { buyerId: user?.user?._id, } }).then((res: any) => {
        if (res.status === 'success') {
            dispatch({ type: 'ADD_CART', payload: { count: res?.cart?.cartCount, cartdata: res?.cart?.data,payment: res?.cart?.payment } })
        }
    })
}
export const deleteCart=async(cart,user,dispatch)=>{
    await request({ url: '/api/cart/cart', method: 'delete', data: { cartId: cart?._id} }).then(async (res: any) => {
        if (res.status === 'success') {
            await getAlladdTocart(user, dispatch)
        }
    })
}
export const increase = async (data: any, user: any, dispatch: any, inc: string) => {
    await addTocart(data, user, dispatch, inc)
}
export const decrease = async (data: any, user: any, dispatch: any, dec: string) => {
    await addTocart(data, user, dispatch, dec)
}
export const addToFav=async(data:any,id:string,reload:any)=>{
    const payload={sellerId:id,favoriteType:'PRODUCT',productId:data._id,isFovrite:true }
    await request({url:'/api/favorite/favorite',method:'post',data:payload}).then((res:any)=>{
        if(reload)reload()
        showNotification(true, res?.message)
    })
}
export const removeToFav=async(data:any,id:string,reload:any)=>{
    const payload={ sellerId:id, favoriteType:'PRODUCT', productId:data._id, isFovrite:false}
    await request({url:'/api/favorite/favorite',method:'put',data:payload}).then((res:any)=>{if(reload)reload()})
}