const Joi = require("joi");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user:process.env.senderAuthEmail,
        pass:process.env.senderAuthPassword
    }
    
});
const secretKey = "Hoss@m2@2@";

module.exports ={
    removeUndefinedkeys : (data) => {
        Object.keys(data).map(key => !data[key] ? delete data[key] : data[key])
        return data;
    },
    validationChar : (field,regx,min=4,msg ='',max = 30)=>Joi.string().regex(regx).min(min).max(max).required().messages( {"string.pattern.base":`${field} match the required pattern ${regx} ${msg} `}),
    errorSchema : (error)=>({msg:error["details"][0]['message'],err:true,code:405}),
    sendMail : async (
        content, //init temp of mail
        to 
    ) =>
    transporter.sendMail({
            from: `Task Managment App`, // sender address
            to, // list of receivers
            subject:"Confirm Account", // Subject line
            text: "", // plain text body
            html: `
             <p> ${content} <p>
          `,
        }
    ),
    errorHandler:(error)=>{
        let errCodes = {
            11000:{msg :`${JSON.stringify( error.keyValue)}  duplicate`,err:true,code:405},
            4007 :{msg :`${JSON.stringify( error.keyValue)}  not found`,err:true,code:404},
            4008: {msg :`can't send mail error :${JSON.stringify( error)} `,err:true},
            4009: {msg :`password not correct`,err:true,code:405},
            4010: {msg :`your account not confirmed please check your mail and confirm your account`,err:true,code:404}  ,
            4012:{msg :`your account not confirmed please check your mail and confirm your account`,err:true,code:404} ,
            4013:{msg :`Task can't update ${JSON.stringify( error)}`,err:true,code:404} ,
            4014:{msg:`Task can't update because this task  for another user`,err:true,code:404},
            'EAUTH' : {msg :`there's problem in auth send mailer but transaction is saved. check your auth and retry`,err:true,code:500} 
            }
            const Codes = errCodes[error.code];
            if (Codes) return Codes;
            return {msg:error,err:true,code:404};
       
    },
    getRole:()=>({admin:"admin",user:"user"}),
    handelResponse:(res,responseData)=>{
        let {data = null ,msg = null ,code = 200 , err} = responseData
        if(err) return res.status(code).json({err,msg})
         return res.json({data,err,msg})
    },
    createToken : (data = {}) =>
     jwt.sign({
        data
    }, secretKey, {
        expiresIn: "10h"
    }),
    verifyToken :(token = "") => jwt.verify(token, secretKey), //verify jwt token
    verfiyIsAdmin:(req,res,next) =>{
        let {authorization} = req.headers;
        if(!authorization) return module.exports.handelResponse(res,{msg:"authorization not found",code:404,err:true})
        let{data:{role,username}} = module.exports.verifyToken(authorization.split(" ")[1])
        if(role != module.exports.getRole().admin ) return module.exports.handelResponse(res,{msg:"authorization not valid",code:405,err:true})
        req.headers.username = username;
        next()
    }
}