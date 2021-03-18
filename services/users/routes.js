const express = require( 'express')
const usersRouter = express.Router()
const DBMongo = require('../DBMongo.class')
const CollectionManager = require('../CollectionManager.class')
const usersController = require('./controller')
const usersModel = require('./model')
const {validateSchema,schema} = require('./middleware')
const {handelResponse,verfiyIsAdmin} = require('../globalFunc')

const handelValidateSchema = (req,res,next,Schema)=>{
    let {err,msg = null,data  = null,code = 200} = validateSchema(Schema,req.body);
    if(err) return res.status(code).json({err,msg}) //if not vlalid
    req.body = data; //inject data in request body
    next();
}



const injectSignUp = async (req,res)=>{
    let usrCtrl = new usersController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(usersModel)
    }) // inject new instance both (mongo and collectionManager service) in usrCtrl
    return handelResponse(res,await usrCtrl.createNewUser(req.body)) //use method instance from class to create new user
    
}


usersRouter.post('/signup',
(req,res,next)=> handelValidateSchema(req,res,next,schema.signUpAsUser),
async (req,res)=>injectSignUp(req,res)) //signup 

usersRouter.post('/signin',(req,res,next)=>handelValidateSchema(req,res,next,schema.signIn)
,async(req,res)=>{
    
    let usrCtrl = new usersController({
        dbService:new DBMongo(),
        colMangService:new CollectionManager(usersModel)
    }) // inject new instance both (mongo and collectionManager service) in usrCtrl
    return handelResponse(res,await usrCtrl.signIn(req.body)) //use method instance from class to create new user 
}) //signin 


usersRouter.post('/resend',(req,res,next)=>handelValidateSchema(req,res,next,schema.resend),async (req,res)=>{
        let usrCtrl = new usersController({
            dbService:new DBMongo(),
            colMangService:new CollectionManager(usersModel)
        }) // inject new instance both (mongo and collectionManager service) in usrCtrl
        return handelResponse(res,await usrCtrl.resendGeneratedCode(req.body)) 
        //use method instance from class
   })


usersRouter.post('/confirm',(req,res,next)=>handelValidateSchema(req,res,next,schema.confirmed),
async (req,res)=>{
        let usrCtrl = new usersController({
            dbService:new DBMongo(),
            colMangService:new CollectionManager(usersModel)
        }) // inject new instance both (mongo and collectionManager service) in usrCtrl
        return handelResponse(res,await usrCtrl.confirmAccount(req.body)) 
        //use method instance from class
   })
 
   //validate Role
   usersRouter.use((req,res,next)=>
   {try{verfiyIsAdmin(req,res,next)}catch(err){
       res.status(404).json({msg:"authorization not valid",err:true})
   }});

usersRouter.post('/newuser',(req,res,next)=> handelValidateSchema(req,res,next,schema.signUpAsAdmin),
async (req,res)=>injectSignUp(req,res)) //create another admin or user by admin auth  


module.exports = usersRouter
