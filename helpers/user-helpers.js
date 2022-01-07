var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const async = require('hbs/lib/async')

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
                    }else{
                        console.log("login failed");
                    }
                })
            }else{
                console.log("login failed- user not found");
            }
        })
    }

}


