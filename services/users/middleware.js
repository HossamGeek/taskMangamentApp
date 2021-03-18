const Joi = require("joi");
const{validationChar,errorSchema} = require('../globalFunc');

const username = validationChar("username",/^[a-zA-Z0-9]*$/);
const password = validationChar("password",/[^a-zA-Z0-9\-\/]/);
const email = Joi.string().required().email({ tlds: { allow: ['com', 'net'] } });
const genereted_code = Joi.string().required();

const usernameSchema = Joi.object().keys({username});
const resendSchema = usernameSchema;
const confirmedSchema = usernameSchema.append({genereted_code});
const userLoginSchema = usernameSchema.append({password});
const userRegisterSchema = usernameSchema.append({password,email});
const adminRegisterSchema = userRegisterSchema.append({
    role:Joi.string().required().valid('admin', 'user')
});


const schema = {
    signUpAsAdmin: adminRegisterSchema,signUpAsUser:userRegisterSchema
    ,signIn:userLoginSchema,confirmed:confirmedSchema,resend:resendSchema
}

const validateSchema = (redirectSchema,{ username,password,email,role,genereted_code })=>{
    const { value, error } =
    redirectSchema.validate({ username,password,email,role,genereted_code },{stripUnknown:true});
    console.log("value",value);
    console.log("error",error);
    if (error) return errorSchema(error);
    return { data: value, err: false };
}

 module.exports = { validateSchema,schema};




