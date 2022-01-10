var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
const async = require('hbs/lib/async')
const { CART_COLLECTION } = require('../config/collections')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data)
        })
    })
    },
    
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response={}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.Email})    // checking user is database or not
            console.log(userData.Password);
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{    // compairing Password or checking
                    if(status){
                        console.log("login Success");
                        response.user=user;
                        response.status=true;
                        resolve(response)
                    }else{
                        console.log("login failed");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("login failed- user not found");
                resolve({status:false})
            }
        })
    },

    addToCart:(proId,userId)=>{
      let proObj={
        item:objectId(proId),
        quantity:1
      }
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            let proExist = userCart.products.findIndex(product=> product.item==proId)
            if(userCart){
              console.log(proExist);
              if(proExist!=-1){
                db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':objectId(proId)},
                {
                  $inc:{'$products.quantity':1}
                })
              }
            //     db.get().collection(collection.CART_COLLECTION)
            //     .updateOne({user:objectId(userId)},
            //     {
                    
            //         $push:{products:proObj}
                    
            //     }
            //     ).then((response)=>{
            //         resolve()
            //     })
            }else{
                let cartObj = {
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((req,res)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
              $match:{user:objectId(userId)}
            },
            {
              $lookup:{
                from:collection.PRODUCT_COLLECTION,
                let:{prodList:'$products'},
                pipeline:[
                  {
                    $match:{
                      $expr:{
                        $in:['$_id',"$$prodList"]
                      },
                    },
                  },
                ],
                as:'cartItems'
              }
            }
          ]).toArray()
          
          resolve(cartItems[0].cartItems)
          
        })
      },

      getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          let count = 0
          let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
          if(cart){
            count=cart.products.length
          }
          resolve(count)
        })
      }
    
}


