import Cart from '../model/cart';
import Product from '../model/product';
const ObjectID = require('mongodb').ObjectId;
import connectDB from '../common/mongod';

connectDB()

export const addtoCart = async (reqbody) => {
    try {
        if (reqbody.quantity === 0) {
            await Cart.findOneAndDelete({ buyerId: reqbody.buyerId, productId: reqbody.productId });
            return { statusCode: 200, status: 'success', message: 'Successfully deleted cart ', }
        }
        const cartDetails = await Cart.findOne({ buyerId: reqbody.buyerId, productId: reqbody.productId });
        let product = await Product.aggregate([{ $match: { $and: [{ _id: ObjectID(reqbody.productId) }] } }, { $project: { quantity: 1, productStatus: 1 } }])
        if (product.length === 0) {
            return { statusCode: 400, status: 'error', message: 'Invalid Product' }
        }
        if (product[0]?.productStatus?.includes('REJECTED')) {
            return { statusCode: 400, status: 'error', message: 'Product Status Rejected, Please Contact by Admin' }
        }
        product = product[0];
        if (cartDetails) {
            const newquantity = cartDetails.quantity + reqbody.quantity;
            if (newquantity > +(product.quantity)) {
                return { statusCode: 400, status: 'error', message: 'you have reached maximum quantity' }
            }
            reqbody.quantity = cartDetails.quantity + reqbody.quantity
            await Cart.updateOne({ buyerId: reqbody.buyerId, productId: reqbody.productId }, reqbody);
            return { statusCode: 200, status: 'success', message: 'Successfully updated cart ', }
        } else {
            if (reqbody.quantity > +(product.quantity)) {
                return { statusCode: 400, status: 'error', message: 'you have reached maximum quantity' }
            }
            let addtoCart = Cart(reqbody)
            await addtoCart.save();
            return { statusCode: 200, status: 'success', message: 'Successfully added cart ' }
        }
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}

export const getAllcart = async (reqbody) => {
    try {
        let cartDetails = await Cart.aggregate([{ $match: { buyerId: ObjectID(reqbody.buyerId) } },
        {
            $addFields: {
                productObjId: {
                    $toObjectId: '$productId'
                }
            },
        }, {
            $lookup: {
                from: 'products',
                localField: 'productObjId', foreignField: '_id',
                pipeline: [{ $match: { $and: [{ isProductDeleted: false }] } }, {
                    $project: { productname: 1, images: 1, quantity: 1, productStatus: 1, isSellerActive: 1, price: 1 }
                }],
                as: 'productDetails'
            }
        },
        {
            $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
        },
        {
            $addFields: {
                sellerObjid: {
                    $toObjectId: '$productDetails.sellerId'
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'sellerObjid', foreignField: '_id',
                pipeline: [{ $project: { name: 1, _id: 0 } }],
                as: 'sellerDetails'
            }
        }, {
            $unwind: { path: "$sellerDetails", preserveNullAndEmptyArrays: true },
        }, {
            $project: { _id: 1, cartDetails: 1, productImage: 1, quantity: 1, price: 1, buyerId: 1, productDetails: 1 }
        }
        ]);
        await Promise.all(cartDetails.map(async (cart) => {
            if (!(cart.productDetails?.isSellerActive === true)) {
                await Cart.deleteOne({ _id: cart._id })
            }
        }))
        if (cartDetails.length === 0) {
            return { statusCode: 200, status: 'success', message: 'Cart is Empty', data: { cartCount: 0 } }
        }
        let totalDeliveryPrice = 0;
        let subTotal = 0;
        let totalamount = 0;

        await Promise.all(cartDetails.map((item, index) => {
            subTotal += item?.productDetails?.price * cartDetails[index]?.quantity
            totalDeliveryPrice = subTotal > 500 ? 0 : 40
            totalamount = subTotal + totalDeliveryPrice
        }))

        return { statusCode: 200, status: 'success', message: 'Successfully fetched cart ', cart: { data: cartDetails || [], cartCount: cartDetails.length, payment: { subTotal: subTotal, delivery: totalDeliveryPrice, totalamount: totalamount } }, }

    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
export const deleteCart = async (reqbody) => {
    try {
        const cart = await Cart.findOneAndDelete({ _id: ObjectID(reqbody.cartId) })
        if (!cart) {
            return { statusCode: 400, status: 'error', message: 'Cart No found' }
        }
        return { statusCode: 200, status: 'success', message: 'Successfully deleted cart ' }
    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}