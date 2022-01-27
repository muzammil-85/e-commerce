
var db = require('../config/connection')
var collection = require('../config/collections');
const { response } = require('express');
var objectId = require('mongodb').ObjectId

module.exports={
    addProduct:(product,callback)=>{
        console.log(product);

        db.get().collection('product').insertOne(product).then((data)=>{
           callback(data.insertedId);
        })
    },
    getAllProducts:(callback)=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            console.log("products");
            console.log(products);
            resolve(products)
        })
    },
    deleteProducts:(productId)=>{
        return new Promise((resolve,reject)=>{
            console.log(objectId(productId));
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(productId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
           
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
                }).then((response)=>{
                    resolve(response)
            })
        })
    }
}