const joi = require('joi');
const joiObjectId = require('joi-objectid')(joi)

module.exports.registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().max(75),
    mobile: joi.string().min(10),
    password: joi.string().min(6).max(30),
    role: joi.string().required().valid('OTHER', 'SELLER', 'ADMIN'),
})
module.exports.getallUserSchema = joi.object({
    page: joi.number().min(1).required(),
    limit: joi.number().min(1).required(),
    filterObj:joi.object({
        role:joi.string().valid('SELLER','ADMIN','OTHER'),
        field:joi.string(),
        value:joi.when('field',{
            is:joi.string().valid('all'),
            then:joi.string().allow("").required(),
            otherwise:joi.string().valid(null)
        }),
        isActive:joi.boolean(),
    }),
    sortObj:joi.object({
        createdAt:joi.number().valid(-1,1),
    }).max(1)
})
module.exports.activeByAdmin = joi.object({
    userId: joi.string().required(),
    isActive: joi.boolean().required(),
});

module.exports.loginSchema = joi.object({
    name: joi.string().required(),
    password: joi.string().min(6).max(30).required(),
})
module.exports.signOutSchema = joi.object({
    token: joi.string().required()
});
module.exports.getCategorySchema = joi.object({
    page: joi.number().min(1).required(),
    limit: joi.number().min(1).required(),
})
module.exports.createCategorySchema = joi.object({
    name: joi.string().min(3).max(30).required(),
})
module.exports.updateCategorySchema = joi.object({
    categoryId: joiObjectId().required(),
    name: joi.string().min(3).max(30).required(),
})
module.exports.deleteCategorySchema = joi.object({
    categoryId: joiObjectId().required(),
})
//products
module.exports.addProductSchema = joi.object({
    sellerId: joiObjectId().required(),
    productname: joi.string().min(3).max(30).required(),
    categoryId: joiObjectId().required(),
    images: joi.array(),
    price:joi.number().required(),
    quantity:joi.number().required(),
    description: joi.string().min(3).max(300).required(),

})
module.exports.getProductSchemabySeller = joi.object({
    sellerId: joiObjectId().required(),
    page: joi.number().min(1).required(),
    limit: joi.number().min(1).required(),
    searchValue: joi.string(),
    primaryFilterObj:joi.object({
        primaryFilterName:joi.string().allow(null),
        primaryFilterValue:joi.string().allow(null),
    }),
    filterObj:joi.object({
        productname:joi.string().allow(null),
        categoryName: joi.string().allow(null),
        productStatus: joi.string().allow(null),
        sellerName: joi.string().allow(null),
        minPrice:joi.number().min(1),
        maxPrice:joi.number().min(1)
    }),
    sortObj: joi.string().valid('createdAt-DESC', 'price-ASC', 'price-DESC'),

})
module.exports.getAllProductSchema = joi.object({
    sellerId: joiObjectId(),
    page: joi.number().min(1).required(),
    limit: joi.number().min(1).required(),
    searchValue: joi.string(),
    primaryFilterObj:joi.object({
        primaryFilterName:joi.string().allow(null),
        primaryFilterValue:joi.string().allow(null),
    }),
    filterObj:joi.object({
        productname:joi.string().allow(null),
        categoryName: joi.string().allow(null),
        productStatus: joi.string().allow(null),
        sellerName: joi.string().allow(null),
        minPrice:joi.number().min(1),
        maxPrice:joi.number().min(1)
    }),
    sortObj: joi.string().valid('createdAt-DESC', 'price-ASC', 'price-DESC'),

})
module.exports.getProductSchemabyAdmin = joi.object({
    page: joi.number().min(1).required(),
    limit: joi.number().min(1).required(),
    filterObj:joi.object({
        productname:joi.string().allow(null),
        categoryName: joi.string().allow(null),
        productStatus: joi.string().allow(null),
        sellerName: joi.string().allow(null),
    }),
    sortObj:joi.object({
        createdAt:joi.number().valid(-1,1),
    }).max(1)
})
module.exports.getProductSchema=joi.object({
    page: joi.number().min(1).required(),
    limit: joi.number().min(1).required(),
    filterObj:joi.object({
        productname:joi.string().allow(null),
        categoryName: joi.string().allow(null),
        productStatus: joi.string().allow(null),
        sellerName: joi.string().allow(null),
    }),
    sortObj:joi.object({
        createdAt:joi.number().valid(-1,1),
    }).max(1)
})
module.exports.getSingleProductScgema = joi.object({
    sellerId: joiObjectId().required(),
})
module.exports.approveProductSchema = joi.object({
    id: joi.string().required(),
    productStatus: joi.string().valid('PENDING', 'APPROVED', 'REJECTED').required(),
})
module.exports.updateProductSchema = joi.object({
    productId: joi.string().required(),
    sellerId: joiObjectId().required(),
    productname: joi.string().min(3).max(30).required(),
    categoryId: joiObjectId().required(),
    images: joi.array(),
    price:joi.number().required(),
    quantity:joi.number().required(),
    description: joi.string().min(3).max(300).required(),

})
module.exports.updateAdminProductSchema = joi.object({
    productId: joi.string().required(),
    productname: joi.string().min(3).max(30).required(),
    categoryId: joiObjectId().required(),
    images: joi.array(),
    price:joi.number().required(),
    quantity:joi.number().required(),
    description: joi.string().min(3).max(300).required(),

})

//cart
module.exports.addtoCartSchema=joi.object({
    buyerId: joiObjectId().required(),
    productId: joiObjectId().required(),
    productname: joi.string().required(),
    productImage:joi.array(),
    quantity:joi.number().required(),
    price:joi.number().required(),
})
module.exports.getAllCartSchema=joi.object({
    buyerId: joiObjectId().required()
})
module.exports.deleteCartSchema=joi.object({
    cartId: joiObjectId().required()
})
//address
module.exports.addAddressSchema=joi.object({
    buyerId: joiObjectId().required(),
    name: joi.string().min(3).max(30).required(),
    address: joi.string().min(3).max(50).required(),
    city: joi.string().min(3).max(30).required(),
    district: joi.string().min(3).max(30).required(),
    state: joi.string().min(3).max(30).required(),
    country: joi.string().required(),
    pincode: joi.string().min(6).required(),
    mobile: joi.string().min(10).required(),
    addressType: joi.string(),
    isDefaultAddress: joi.boolean(),
})
module.exports.updateAddressSchema=joi.object({
    addressId: joiObjectId().required(),
    buyerId: joiObjectId().required(),
    name: joi.string().min(3).max(30).required(),
    address: joi.string().min(3).max(50).required(),
    city: joi.string().min(3).max(30).required(),
    district: joi.string().min(3).max(30).required(),
    state: joi.string().min(3).max(30).required(),
    country: joi.string().required(),
    pincode: joi.string().min(6).required(),
    mobile: joi.string().min(10).required(),
    addressType: joi.string(),
    isDefaultAddress: joi.boolean(),
})
module.exports.getAllAddressSchema=joi.object({
    buyerId: joiObjectId().required()
})
module.exports.getbyIdAddressSchema=joi.object({
    buyerId: joiObjectId().required(),
    addressId: joiObjectId().required(),
})
module.exports.deleteAddressSchema=joi.object({
    buyerId: joiObjectId().required(),
    addressId: joiObjectId().required(),

})
//favorite
module.exports.addtoFovoriteSchema=joi.object({
    sellerId: joiObjectId().required(),
    favoriteType: joi.string().valid('PRODUCT').required(),
    productId:joi.when('favoriteType',{
        is:joi.string().valid('PRODUCT'),
        then:joiObjectId().required(),
        otherwise:joi.valid(null)
    }),
    isFovrite:joi.boolean().required()

})

