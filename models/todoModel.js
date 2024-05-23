const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
    {
    todo : {
        type : 'String',
        required : true,
        trim : true,
        minLength : 5,
        maxLength : 100
    },
    username : {
        type : 'string',
        required : true,
        ref : 'user'
    }
    },
    {
        timestamps : true,
    }
)


module.exports = mongoose.model('todo',todoSchema);