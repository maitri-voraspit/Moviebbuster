// __dirname basically is the complete directory name

//console.log(__dirname) will give us /workspace/maitri/YelpCamp/v4
var express= require("express");
var app= express();
app.set("view engine", "ejs");
var bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))
var mongoose= require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var localStrategy=require("passport-local");
const axios = require('axios');
var methodOverride=require("method-override");
// mongoose.connect('mongodb://localhost:27017/yelp12', {
	mongoose.connect('mongodb+srv://moviebuster:moviebuster@moviebuster.xm21i.mongodb.net/moviebuster?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
//SCHEMA SETUP
var Campgrnd=require("./models/campground.js");
var seedDB=require("./seeds.js");
var commentRoutes=require("./routes/comments");
var campgroundsRoutes=require("./routes/campgrounds");
var authRoutes=require("./routes/auth");

var Comment=require("./models/comment.js")
var User=require("./models/user.js")
//seedDB();

app.use(methodOverride("_method"));
app.use(flash());


app.locals.moment = require('moment');//for timings
//PASSPORT CONFIG


app.use(require("express-session")({
	 secret: "Welcome to yelpcamp",
     resave: false,
     saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new  localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	

	next();
});



app.get("/", function(req,res){
	res.render("landing");
});

app.use(authRoutes);
app.use("/campgrounds",campgroundsRoutes);//All campground routes should start with /campgrounds
app.use("/campgrounds/:id/comments", commentRoutes);//comments.js wont recognize the id 




app.get("/results", function(req,res){
	
	var query=req.query.submit;
	
	var url="http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
	axios.get(url)
  .then(function (response) {
		var data=response.data;
		if(!data.Search){
			req.flash("error","Sorry cannot find the movie");//from app.js
			return res.redirect("/campgrounds");
		}
		
      res.render("results", {data:data,name:query});
  })
  .catch(function (error) {
   console.log("error");
  })
  .finally(function () {

  });
})
app.get("/results/:movieID",function(req,res){
	
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});

// RESTFUl ROUTEs

// name    url         verb   disc

// ===============================

// INDEX   /dogs       GET     display list of dogs

// NEW     /dogs/news  POST    display form to make new dogs

// CREATE  /dogs       POST    Create a new dog

// SHOW    /dogs/:id   GEt     Shows info about dog