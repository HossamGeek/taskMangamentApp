const mongoose = require('mongoose');

class CollectionManager{ // as module for you can manage (create, update, delete,etc) for any collection   
    constructor(Collection){
        this._Collection = Collection;
    }
    async create(collection_data){
        let new_collection = new this._Collection(collection_data);
        return await new_collection.save();
    }

    //GET
    async find_by_id(_id){
        return await this._Collection.find({_id: mongoose.Types.ObjectId(_id)});
    }
    
    async find_by_args(args,limit = null){
        return await this._Collection.find(args,null,{limit});
    }

    async findOneAndUpdate(args,update){
        console.log(args,update);
        return await this._Collection.findOneAndUpdate(args,update, { useFindAndModify: false,new: true });
    }
    

    async findByIdAndUpdate(id,update){
        console.log(id,update);
        return await this._Collection.findByIdAndUpdate(id,update, { useFindAndModify: false,new: true });
    }
    async findOneAndRemove(args){
        return await this._Collection.findOneAndRemove(args);
    }

}
module.exports = CollectionManager;