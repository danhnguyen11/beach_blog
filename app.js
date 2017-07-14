var express          = require('express'),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    Blog             = require("./models/beach"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    User             = require("./models/user");
    
    
var beachRoutes = require("./routes/beach");
var userRoutes  = require("./routes/user");
var commentRoutes = require("./routes/comment")

var googleMapsClient = require("@google/maps").createClient({
   key: "AIzaSyCBr8rcU0kcsz1FT_bHCQnmeRqLg_7fEsM" 
});

//mongoose.connect("mongodb://localhost/beach_blog");
mongodb://dan:dan@ds157682.mlab.com:57682/beach_blog;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Beaches are awesome!",
    resave: false,
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/blogs",beachRoutes);
app.use("/",userRoutes);
app.use("/blogs/:id/comments",commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started...")
})