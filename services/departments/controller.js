const {errorHandler} = require("../globalFunc");


class Depart {
    constructor({dbService=null,colMangService=null}){
        this._dbService = dbService;
        this._colMangService = colMangService;
    }

    async createNewDepart({createdBy,depart_name,depart_id}){
        try{
          
            let newDepart = this._colMangService.create({createdBy,depart_name,depart_id}); //define collection method
            let {execute = null,error = null} = await this._dbService.createInstanceOfConnection(newDepart); 
            //create new connection and execute collection method and close connection
            if(error) throw (error)
            return {data:{execute},err:false};
        }catch(error){
           console.log('err ctrl',error);
           return errorHandler(error)    
        }
    }


    async findAll(){
        try{
            let getAll =  this._colMangService.find_by_args({});
            let {execute = null ,error = null} = await this._dbService.createInstanceOfConnection(getAll);
            if(error) throw (error)
            if(!execute.length) throw ({code:4007,keyValue:{username}})
            return {data:execute,err:false};
        }catch(error){
            console.log('err ctrl',error);
            return errorHandler(error)  
        }

    }



    
}

module.exports= Depart;