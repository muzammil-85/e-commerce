var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products});
  })
 

});

router.get('/add-product',function(req,res){
  res.render('admin/add-product')
});
router.post('/add-product',(req,res)=>{
  // console.log(req.body);
  // console.log(req.files.image);
  productHelpers.addProduct(req.body,(id)=>{
    let image = req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-product")
      }else{
        console.log(err);
      }
    })
    
  })
});

router.get('/delete-product/:id',(req,res)=>{ // another by using query '?'
    let proId = req.params.id
    console.log(proId);
    productHelpers.deleteProducts(proId).then((response)=>{
      res.redirect('/admin/')
    })
})

router.get('/edit-product/:id',async function (req, res) {
    let product = await productHelpers.getProductDetails(req.params.id);
    res.render('admin/edit-product',{product});
  })

router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    let id = req.params.id
    res.redirect('/admin')
    if(req.files.image){
      
      let img = req.files.image
      
      img.mv('./public/product-images/'+id+'.jpg')
    }
    
    
  })
})

module.exports = router;
