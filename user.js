var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    mail: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname:  { type: String, required: true },
    city:{type:String,required:true},
    tel:{type:Number,required:true},
    service: { type: String, required:true },
    tools:{type:String}
});

module.exports = mongoose.model('User', UserSchema);
