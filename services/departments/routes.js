const express = require( 'express')
const departRouter = express.Router()
const DBMongo = require('../DBMongo.class')
const CollectionManager = require('../CollectionManager.class')
const departsController = require('./controller')
const departsModel = require('./model')
const {handelResponse,verfiyIsAdmin} = require('../globalFunc')
const validBodyData = (req,res,next)=>{
    let {username:createdBy} = req.headers;
    let {depart_name,
        depart_id} = req.body;
    let notFound = (field) => !field || !field.length    
    if(notFound(depart_name) && notFound(depart_id) ) return res.status(404)
    .json({msg:"depart_name and depart_id is required"}) 
    req.body= {depart_name,createdBy,
        depart_id}
    next()
}

departRouter.get('/all'
,async(req,res)=>{
    let departCtrl = new departsController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(departsModel)
    }) // inject new instance both (mongo and collectionManager service) in departCtrl
    return handelResponse(res,await departCtrl.findAll()) //use method instance from class to create new user 
}) //signin 


 //validate Role
 departRouter.use((req,res,next)=>verfiyIsAdmin(req,res,next));

 departRouter.post('/new',(req,res,next)=>validBodyData(req,res,next),async(req,res)=>{
    let departCtrl = new departsController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(departsModel)
    }) // inject new instance both (mongo and collectionManager service) in departCtrl
    return handelResponse(res,await departCtrl.createNewDepart(req.body)) //use method instance from class to create new user 
}) //signin 









module.exports = departRouter
