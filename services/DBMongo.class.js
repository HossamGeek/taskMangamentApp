const mongoose = require('mongoose');
require('events').EventEmitter.prototype._maxListeners = 0;

class DBMongo{
    constructor(){
        this._port = 27017;
        this._host = 'localhost';
        this._db_name = 'taskManagement';
    }

    async createInstanceOfConnection(collectionMethod){
        let client = null;
        try {
                client =  await mongoose.connect(
                        `mongodb://${this._host}:${this._port}/${this._db_name}`
                        ,{useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true  }); //to create new connection 
                let execute = await collectionMethod; //to execute method from collection manager (create,update,find)
                return {execute};
        }catch(error){
                    console.log("err DBmongo",error);
                    return{error}
        }finally{ 
                   if(client) await client.connection.close(); // after execute close connection
                   client = null;
                      
                }       
    }
    
}

module.exports = DBMongo;