const {errorHandler,sendMail,removeUndefinedkeys} = require("../globalFunc");

let handelSendMail = async(content,email)=>{
    let {accepted} = await sendMail(content,email); //send generate code
    if(!accepted.length) throw ({code:4008}) //if has error
    return accepted;
} 

class Task {
    constructor({dbService=null,colMangService=null}){
        this._dbService = dbService;
        this._colMangService = colMangService;
    }

    async createNewtask({createdBy,email,phone,depart_id,name,responsible_name}){
        try{
            
            let newTask = this._colMangService.create(removeUndefinedkeys({createdBy,email,phone,depart_id,name,responsible_name})); //define collection method
            let {execute = null,error = null} = await this._dbService.createInstanceOfConnection(newTask); 
            //create new connection and execute collection method and close connection
            if(error) throw (error)
            await handelSendMail(`Task  : ${name} is created`,email); //send mail
            return {data:{msg:"Task is created",execute},err:false};
        }catch(error){
           console.log('err ctrl',error);
           return errorHandler(error)    
        }
    }


    async findAll({createdBy,depart_id,responsible_name,email,status}){
        try{
            let getAll =  this._colMangService.find_by_args(removeUndefinedkeys({createdBy,depart_id,responsible_name,email,status}));
            let {execute = null ,error = null} = await this._dbService.createInstanceOfConnection(getAll);
            if(error) throw (error)
            if(!execute.length) throw ({code:4007,keyValue:{username}})
            return {data:execute,err:false};
        }catch(error){
            console.log('err ctrl',error);
            return errorHandler(error)  
        }

    }


    async updateTask ({id,createdBy},{status,depart_id,responsible_name,email,name,phone}){
        let where = {_id:id};
        try{
            if(createdBy) where = {_id:id,createdBy}
            let updateUser =  this._colMangService.findOneAndUpdate(where,removeUndefinedkeys({depart_id,phone,responsible_name,email,status,name}));
            let {execute = null ,error = null} = 
            await this._dbService.createInstanceOfConnection(updateUser);
            if(error) throw (error)
            if(execute == null) throw ({code:4014})
            let {status:upStatus,email:sendEmail} = execute;
            if(status && status != upStatus) throw ({code:4013})
            await handelSendMail(`Task is ${upStatus}`,sendEmail);
            return {data:{msg:`Task is ${status ? upStatus : "updated"}`},err:false};
        }catch(error){
            console.log('err ctrl',error);
            return errorHandler(error)  
        }
    }



    
}

module.exports= Task;