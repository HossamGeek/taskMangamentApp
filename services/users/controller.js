const {removeUndefinedkeys,sendMail,errorHandler,createToken} = require("../globalFunc");
const bcrypt = require('bcrypt');
const randomcode = require('random-number');
let gencode =randomcode.generator({min: 91743165,max:99743165,integer: true})

let handelSendMail = async(content,email)=>{
    let {accepted} = await sendMail(content,email); //send generate code
    if(!accepted.length) throw ({code:4008}) //if has error
    return accepted;
} 

class Users {
    constructor({dbService=null,colMangService=null}){
        this._dbService = dbService;
        this._colMangService = colMangService;
    }

    async createNewUser({username,password,email,role}){
        try{
            password = await bcrypt.hash(password, 10);
            let genrated_code = gencode();
            let newUser = this._colMangService.create(removeUndefinedkeys({username,password,email,role,genrated_code})); //define collection method
            let {error = null} = await this._dbService.createInstanceOfConnection(newUser); 
            //create new connection and execute collection method and close connection
            if(error) throw (error)
            await handelSendMail(`your confirm code : ${genrated_code}`,email); //send mail
            return {data:{msg:"check mail to confirm account"},err:false};
        }catch(error){
           console.log('err ctrl',error);
           return errorHandler(error)    
        }
    }


    async findUser({username}){
        let getUser =  this._colMangService.find_by_args({username},1);
        let {execute = null ,error = null} = await this._dbService.createInstanceOfConnection(getUser);
        if(error) throw (error)
        if(!execute.length) throw ({code:4007,keyValue:{username}})
        return execute;
    }

    async updateUser({username},update = {}){
        let updateUser =  this._colMangService.findOneAndUpdate({username},update);
        let {execute = null ,error = null} = 
        await this._dbService.createInstanceOfConnection(updateUser);
        if(error) throw (error)
        return execute;
    }
    async resendGeneratedCode ({username}){
        try{
            let getUser =  this._colMangService.find_by_args({username},1);
            let {execute = null ,error = null} = await this._dbService.createInstanceOfConnection(getUser);
            if(error) throw (error)
            if(!execute.length) throw ({code:4007,keyValue:{username}}) //if user not exist
            let [{email,genrated_code}] = execute;
            await handelSendMail(`your confirm code : ${genrated_code}`,email); //send generate code
            return {data:"resend success check you mail",err:false};
        }catch(error){
            console.log('err ctrl',error);
            return errorHandler(error)  
        }
    }

    async confirmAccount ({username,genereted_code}){
        try{

            let getUserExcute =  await this.findUser({username});
            let [{email,genrated_code:Gcode}] = getUserExcute;
            if(Gcode != genereted_code) {
                await handelSendMail(`your confirm code : ${genrated_code}`,email);
                throw ({code:4011})
            }
            let updateUser = await this.updateUser({username},{is_confirmed:true})
            let {is_confirmed} = updateUser;
            if(!is_confirmed) throw ({code:4012})
            await handelSendMail(`your account is confirmed`,email);
            return {data:{msg:`your account is confirmed please signin`,is_confirmed},err:false};
        }catch(error){
            console.log('err ctrl',error);
            return errorHandler(error)  
        }
    }



    async signIn ({username,password}){
        try{
            let execute =  await this.findUser({username});
            let [{password:hash,email,role,is_confirmed}] = execute;
            if(!is_confirmed)throw ({code:4010})
            if(!(await bcrypt.compare(password, hash))) throw ({code:4009})
            return {data:{username,email,token_id: createToken({username,email,role})},err:false};
            
        }catch(error){
            console.log('err ctrl',error);
            return errorHandler(error)  
        }
    }
    
}

module.exports= Users;