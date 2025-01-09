const mongoose = require("mongoose");
const {Schema} = mongoose;

const NotesSchema = new Schema({
    user:{
        // associating notes with the user 
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:"General",
    },
    date:{
        type:Date,
        default: Date.now,
    }
});


// export
module.exports = mongoose.model("notes",NotesSchema);