var router = require('express').Router();

router.get('/test1',function(req,res){
    res.render('test/1.ejs')
})
router.get('/test2',function(req,res){
    res.render('test/2.ejs')
})
router.get('/',function(req,res){
    res.send('테스트홈')
})

module.exports = router;