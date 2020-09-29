var express=require("express");
var router=express.Router();
var Campgrnd=require("../models/campground");
var middleware=require("../middleware")
router.get("/", function(req,res){
	Campgrnd.find({},function(err, allcampground){
		if(err){
			console.log("err");
		}
		else{
			
			res.render("campgrounds/index",{campgrounds : allcampground, currentUser:req.user});
		}
	});
	
	
});
router.post("/",middleware.isLoggedIn, function (req,res){
	//get data from form and add to the campgrounds array

// to get the data from the form which is sending that data we use req.body.name and req.body.image ad "name" and "image" are the names of the form input type

//Use post when u take data from a form(form is in different route) and then that form data has to be presented on the website

	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	
	var newCampground={name: name ,price:price,image:image , description:description, author:author}
	//Creating new campground and saving it to DB
	Campgrnd.create(newCampground,function(err, newly){
		if(err){
			console.log("err");
		}
		else{
			
			res.redirect("/campgrounds");
		}
	});
	

});
router.get("/new", middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
router.get("/:id",function(req,res){//Order of route is important

//find the campground with the provided provided ID
	Campgrnd.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
		//general syntax is function(error,callback)

// foundCampground is the data coming back from the findById function
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campgrounds: foundcampground});
		}
	})
	
});
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){//middleware is called before route handler
	
			Campgrnd.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit", {campground:foundCampground});
			});
});

//UPGRADE CAMPGROUND ROuTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campground and redirect to show page
	
	Campgrnd.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			console.log(err)
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})


//Destroy campgrounds
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campgrnd.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err)
		}
		else{
			res.redirect("/campgrounds");
		}
	})
})




module.exports=router;