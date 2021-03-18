const express = require( 'express')
const taskRouter = express.Router()
const DBMongo = require('../DBMongo.class')
const CollectionManager = require('../CollectionManager.class')
const tasksController = require('./controller')
const tasksModel = require('./model')
const {handelResponse,verfiyIsAdmin} = require('../globalFunc')
const { validateSchema} = require('./middleware')

const  handleFindTask = async (req,res)=>{
    let taskCtrl = new tasksController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(tasksModel)
    }) // inject new instance both (mongo and collectionManager service) in taskCtrl
    return handelResponse(res,await taskCtrl.findAll(req.params)) //use method instance from class to create 
}


const handleUpdateStatus = async (req,res)=>{
    let {id} = req.params;
    let status = (req.path.split('/')[1]);
    let taskCtrl = new tasksController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(tasksModel)
    }) // inject new instance both (mongo and collectionManager service) in taskCtrl
    return handelResponse(res,await taskCtrl.updateTask({id},{status})) //use method instance from class to create new user 
}


//find task
taskRouter.get('/all'
,async(req,res)=>{
    let taskCtrl = new tasksController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(tasksModel)
    }) // inject new instance both (mongo and collectionManager service) in taskCtrl
    return handelResponse(res,await taskCtrl.findAll({})) //use method instance from class to create new user 
}) // 

//find task By >>
taskRouter.get('/createdBy/:createdBy',async(req,res)=>await handleFindTask(req,res) ) // 


taskRouter.get('/departId/:depart_id',async(req,res)=>await handleFindTask(req,res)) // 


taskRouter.get('/responsible_name/:responsible_name',async(req,res)=>await handleFindTask(req,res)) // 

taskRouter.get('/status/:type',async(req,res)=>await handleFindTask(req,res)) // 


//update status by user
taskRouter.put('/done/:id',async(req,res)=>await handleUpdateStatus(req,res)) //



 //validate Role
 taskRouter.use((req,res,next)=>
 {try{verfiyIsAdmin(req,res,next)}catch(err){
     res.status(404).json({msg:"authorization not valid",err:true})
 }});



 taskRouter.post('/new',(req,res,next)=>{
    let {username} = req.headers;
    let {err,msg = null,data  = null,code = 200} = validateSchema(req.body);
    if(err) return res.status(code).json({err,msg}) //if not vlalid
    data['createdBy'] = username;
    req.body = data; //inject data in request body
    next();
 },async(req,res)=>{
    let taskCtrl = new tasksController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(tasksModel)
    }) // inject new instance both (mongo and collectionManager service) in taskCtrl
    return handelResponse(res,await taskCtrl.createNewtask(req.body)) //use method instance from class to create new user 
}) //signin 

taskRouter.put('/update/:id',(req,res,next)=>{
    let {username} = req.headers;
    let {err,msg = null,data  = null,code = 200} = validateSchema(req.body);
    if(err) return res.status(code).json({err,msg}) //if not vlalid
    data['createdBy'] = username;
    req.body = data; //inject data in request body
    next();
 },async(req,res)=>{
    let {id} = req.params;
    let {createdBy} = req.body
    let taskCtrl = new tasksController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(tasksModel)
    }) // inject new instance both (mongo and collectionManager service) in taskCtrl
    return handelResponse(res,await taskCtrl.updateTask({id,createdBy},req.body)) //use method instance from class to create new user 
}) //signin 



//update status by admin


taskRouter.put('/confirm/:id',async(req,res)=>await handleUpdateStatus(req,res)) //

taskRouter.put('/deactivate/:id',async(req,res)=>await handleUpdateStatus(req,res)) //








module.exports = taskRouter
