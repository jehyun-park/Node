var router = require('express').Router();

router.get('/write',function(req,res){
    res.render('board/write.ejs')
})
router.get('/',function(req,res){   //sort 정렬 -1 : 내림차순 / 1 : 올림차순
    db.collection('board').find().sort({"_id":-1}).toArray(function(err,result){
        //console.log(result)
        res.render('board/list.ejs',{rows : result})
    })  
})
router.post('/ok',function(req,res){
    db.collection('counter').findOne({name:'bCounter'},function(err,result){
        var totalPost = result.totalRecord;
    
        db.collection('board').insertOne({_id : (totalPost + 1), title : req.body.title,name : req.body.name,content : req.body.memo,wdate : req.body.wdate},function(err,result){
        
            db.collection('counter').updateOne({name:'bCounter'},{$inc:{totalRecord:1}},function(err,result){
                if(err) {return console.log(err)}
                res.redirect('/board/list');
            })
            //$set : 변경 / $inc : 더하기
            //console.log(req.body);
        //res.send('전송완료')  //반드시 존재해야한다.
        
        });    
    }); 
});

router.get('/list',function(req,res){   //sort 정렬 -1 : 내림차순 / 1 : 올림차순
    db.collection('board').find().sort({"_id":-1}).toArray(function(err,result){
        //console.log(result)
        res.render('board/list.ejs',{rows : result})
    })  
})

router.get('/detail/:id',function(req,res){
    db.collection('board').findOne({_id:parseInt(req.params.id)},function(err,result){
        res.render('board/detail.ejs',{rows : result})
    })
    //res.render('detail.ejs')
});

router.get('/edit/:id',function(req,res){
    db.collection('board').findOne({_id:parseInt(req.params.id)},function(err,result){
        res.render('board/edit.ejs',{rows : result})
    })
    
});

router.get('/del/:id',function(req,res){
    db.collection('board').deleteOne({_id:parseInt(req.params.id)},function(err,result){
        res.redirect('/board/list')
    })
})

router.put('/edit',function(req,res){
    db.collection('board').updateOne({_id : parseInt(req.body.id)},{$set : {title : req.body.title, name : req.body.name,content : req.body.memo,wdate : req.body.wdate}},function(){
        res.redirect('/board/list')
    })    
})

router.get('/search',function(req,res){
    db.collection('board').find({title : RegExp(req.query.value)}).toArray(function(err,result){
        res.render('board/search.ejs',{rows : result})
    })     
})

module.exports = router;