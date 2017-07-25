var express = require("express");
var router  = express.Router();
var Blog    = require("../models/beach");
var middleware = require("../middleware/index");
var googleMapsClient = require("@google/maps").createClient({
   key: "AIzaSyCBr8rcU0kcsz1FT_bHCQnmeRqLg_7fEsM" 
});

router.get("/",function(req,res){
    Blog.find({},function(err,blogs){
        if (err) {
            console.log(err);
            //res.redirect("/blogs");
        } else {
            res.render("index",{blogs: blogs});
        }
    });
});

router.get("/",function(req,res){
    res.redirect("/blogs");
})

router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("new");
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var address = req.body.address;
    var image = req.body.image;
    var body = req.body.body;
    var created = req.body.timestamp;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var lat = "";
    var lng = "";
    var newBlog = {name:name, address:address,image:image,body:body,created:created,author:author,lat:lat,lng:lng};
    
   Blog.create(newBlog,function(err,newlyCreated){
       if(err){
           res.redirect("/blogs/new");
           console.log(err);
       } else {
           console.log(newlyCreated);
           res.redirect("/blogs");
       }
   }) 
});

router.get("/:id",function(req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
        var found = foundBlog;
        googleMapsClient.geocode({
        address: foundBlog.address,
        }, function(err, response) {
        if (!err) {
        var cor= response.json.results;
        found.lat = cor[0].geometry.location.lat;
        found.lng = cor[0].geometry.location.lng;
        console.log(found);
        res.render("show",{blog: found});
    }
    })
    //    if(err){
      //     res.redirect("/blogs");
    //    }else {
     //   console.log(found);
      //  res.render("show",{blog: foundBlog});
    //    }
    });
});

router.get("/:id/edit",middleware.checkBlogOwnership,function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
          res.redirect("/blogs");
       } else {
           res.render("edit",{blog: foundBlog});
       }
    });
});

router.put("/:id",middleware.checkBlogOwnership,function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
           res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

router.delete("/:id",middleware.checkBlogOwnership,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
           res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

module.exports = router;