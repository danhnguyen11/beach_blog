var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    name: String,
    address: String,
    image:String,
    body: String,
    created: {type: Date, default:Date.now},
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   lat: Number,
   lng: Number
});

module.exports = mongoose.model("Blog", blogSchema);
