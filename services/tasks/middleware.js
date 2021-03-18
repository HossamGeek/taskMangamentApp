const Joi = require("joi");
const{validationChar,errorSchema} = require('../globalFunc');
const name = validationChar("name",/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%* #+=\(\)\^?&])[A-Za-z\d$@$!%* #+=\(\)\^?&]*$/,8,"'must be contain at least one capital character,one number and one speachial character and not less 8 character'");
const responsible_name = validationChar("responsible_name",/^[a-zA-Z]/,5,"'must start with character and not less tan 5 character'");
const email = Joi.string().required().email({ tlds: { allow: ['com', 'net'] } });
const phone = validationChar("phone",/^(?=.*011|012|010|015)(?=.*\d)[011|012|010|015\d]*$/,11,"'phone must start 011 | 012 | 010 | 015 and equal 11 number'",11);
const depart_id = Joi.number().required();


const taskSchema = Joi.object().keys({name,
    responsible_name,
    email,phone,depart_id});



const validateSchema = ({ name,
    responsible_name,
    email,phone ,depart_id})=>{
    const { value, error } =
    taskSchema.validate({ name,
        responsible_name,
        email,phone ,depart_id },{stripUnknown:true});
    console.log("value",value);
    console.log("error",error);
    if (error) return errorSchema(error);
    return { data: value, err: false };
}

 module.exports = { validateSchema};




