import User from '../model/user';
import Cart from '../model/cart';
const ObjectID = require('mongodb').ObjectId;
import connectDB from '../common/mongod';
import OrderMaster from '../model/orderMaster';
import order from '../pages/api/order/order';

connectDB();
export const orderVerfiy = async (reqbody) => {
    try {
        let totalTaxAmount = 0, deliveryAmount = 0, subTotal = 0, totalAmount = 0, inactiveSellerProducts = [], orderItem = []
        const sellers = await User.findOne({ _id: ObjectID(reqbody.sellerId) })
        let cartList = await Cart.aggregate([{ $match: { buyerId: ObjectID(reqbody.sellerId) } },
        {
            $addFields: {
                productObjectId: { $toObjectId: "$productId" },
                buyerObjectId: { $toObjectId: '$buyerId' }
            }
        },
        {
            $lookup: {
                from: 'products', localField: 'productObjectId', foreignField: '_id',
                pipeline: [{
                    $project: {
                        productname: 1, isProductDeleted: 1, sellerId: 1,
                    }
                }],
                as: 'productDetails'
            }
        },
        { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                sellerObjectId: {
                    $toObjectId: '$productDetails.sellerId'
                }
            }
        },
        {
            $lookup: {
                from: 'addresses', localField: 'productDetails.sellerId', foreignField: '_id',
                pipeline: [{
                    $project: {
                        name: 1, address: 1, city: 1, district: 1, state: 1, pincode: 1, mobile: 1
                    }
                }],
                as: 'addressDetails'
            }
        },
        { $unwind: { path: '$addressDetails', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'users', localField: 'sellerObjectId', foreignField: '_id',
                pipeline: [{
                    $project: {
                        name: 1, email: 1, isActive: 1
                    }
                }],
                as: 'userDetails'
            }
        },
        { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }, }
        ]);
        if (cartList.length === 0) {
            return { statusCode: 400, status: 'error', message: 'Cart Item is Empty' }
        }
        for (let [index, element] of cartList.entries()) {
            if (element?.userDetails?.isActive) {
                let carts = {
                    productId: cartList[index].productId,
                    sellerId: element?.productDetails?.sellerId,
                    productDetails: element.productDetails,
                    quantity: cartList[index].quantity
                }
                orderItem.push(carts)
            } else {
                inactiveSellerProducts.push(element?.productDetails)
            }
        }
        if (inactiveSellerProducts.length !== 0) {
            return { statusCode: 400, status: 'error', message: 'Seller inactive product not allowed', inactiveSellerProducts: inactiveSellerProducts }

        }
        const orderList = await uniqueSellersOrders(orderItem);
        const orderdetails = {
            orderDate: new Date(),
            sellerId: reqbody.sellerId,
            orderList: orderList || [],
        }
        const orderMaster = new OrderMaster(orderdetails)
        const orderItems = await orderMaster.save();

        return {
            statusCode: 200, status: 'success', message: 'Successfully fetched cartService is available, Proceed to payment ', orderData: {
                orderId: orderItems._id
            }
        }
    }
    catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}
const uniqueSellersOrders = async (orderItem) => {
    try {
        let orders = [];
        const uniquesellerId = [...orderItem.reduce((arr, obj) => {
            arr.set(obj.sellerId, obj.sellerId)
            return arr
        }, new Map()).values()]

        await Promise.all(uniquesellerId.map(async (unique) => {
            let sameSellerProducts = orderItem.filter(item => (item.sellerId === unique))
            let sameData = {};
            let productDetails = [];
            if(sameSellerProducts.length>0){

            }else{
              orders.push(sameData)
            }
        }))
        return orders
    } catch (error) {
        return { statusCode: 500, status: 'error', message: error.message };
    }
}