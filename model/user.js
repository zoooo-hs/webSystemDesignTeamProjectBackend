var db = require('mongoose');
var Schema = db.Schema;
var Post = require('./post');

var userSchema = new Schema({
    email:	{type: String, required: true},
    nickname:   {type: String, required: true},
    password:       {type: String, required: true}
});

module.exports= db.model('user',userSchema);
