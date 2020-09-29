var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

//=====================
//Auth  ROUTES
//=====================
//show sign form
router.get("/register", function(req,res){
	res.render("register");
});
//handling form
router.post("/register", function(req,res){
	
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){  
			req.flash("error", err.message); 
			return res.redirect("/register");
		}
			passport.authenticate("local")(req,res,function(){
				req.flash("success", "Welcome to Moviebuster "+user.username);

				res.redirect("/campgrounds");
			})
		
})
});

//==================
	//LOGIN routes
//==================
router.get("/login", function(req,res){
	
	res.render("login");
});
	//handling login(middleware)
//syntax -- > app.post("/login",middleware,callback);
router.post("/login",passport.authenticate("local",{
	//It will use the method given to use for free from the passportlocalmongoose package and it will then take req.body.password, req.body.username and will authenticate that password with what we have stored in the database. It takes care of all the complex logic that we dont have to take of.

//========================IMPORTANT========================

//This is the same passport.authenticate that we used inside app.post("register). The difference is in "register" we are doing other things before we run passport.authenticate i.e we are making anew user then registering it and if that works we are running passport.authenticate and logging in the user.But in "login" we have already presumed that user is existing and all we do is run passport.authenticate which will log them in.
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}), function(req,res){
	
});
//==================
	//LOGout routes
//==================
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success","Logged you out");//from app.js
	res.redirect("/campgrounds");
});
//Middleware to check isLoggedIn

//Here next is basically the function or the callback that will be called for example-->

// In the following get request-->

//The function called after the isLoggedIn parameter will run  when next() is returned

// app.get("/campgrounds/:id/comments/new",function(req,res){

// Campground.findById(req.params.id,isLoggedIn,function(err,campground){

// if(err){

// console.log(err)

// }else{

// res.render("comments/new",{campground:campground});

// }

// })

// })

//If in this case we are not loggedin we wont be abe to run the route and get the comment form instead we will be redirected back to the login page.


module.exports=router;