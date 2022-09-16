var router = require('express').Router();
let multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/image')
    },
    filename : function(req,file,cb){
        cb(null,Date.now() + "-" + file.originalname)
    }

})
var upload = multer({storage : storage});


router.get('/',function(req,res){
    db.collection('photo').find().sort({"_id":-1}).toArray(function(err,result){
        res.render('gallery/list.ejs',{row:result})
    })
});

router.get('/write',function(req,res){
    res.render('gallery/write.ejs')
})

router.post('/ok',upload.single('file'),function(req,res){
    db.collection('photo_counter').findOne({name:'PCounter'},function(err,result){
    var g_counter = result.totalRecord;
    var now = new Date();       
    db.collection('photo').insertOne({wdate:now.toLocaleString(),_id:g_counter + 1, title:req.body.title,name:req.body.name,file:req.file.filename},
    function(){
            console.log(req)
           
    db.collection('photo_counter').updateOne({name:'PCounter'},{$inc : {totalRecord:1}},
    function(){
        res.redirect('/gallery/list')
            })        
        })
    })    
})

router.get('/list',function(req,res){
    db.collection('photo').find().sort({"_id":-1}).toArray(function(err,result){
        res.render('gallery/list.ejs',{row:result})
    })
})

router.get('/del/:id',function(req,res){
    db.collection('photo').deleteOne({_id : parseInt(req.params.id)},function(err,result){
        console.log(result)
        res.redirect('/gallery/list')
    })
})


module.exports = router;