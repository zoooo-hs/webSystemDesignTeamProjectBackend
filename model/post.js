var db = require('mongoose');
var Schema = db.Schema;

var post = new Schema({
    title: {type: String},
    hint:   {type:String},
    author:   {type: String},
    nation: {type: String},
    duration: {type: Number},
    date:       {type: Date, required: true, default: Date.now()},
    number:     {type:String, required: true},
    markers: [{}],
    image_url: {type: String}
});

module.exports= db.model('Post',post);
