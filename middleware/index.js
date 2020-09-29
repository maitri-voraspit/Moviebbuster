//all the middleware goes here
var Campgrnd=require("../models/campground");
var Comment=require("../models/comment");

var middlewareObj={};
middlewareObj.checkCampgroundOwnership=function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
		// does user own the campground?
		Campgrnd.findById(req.params.id,function(err,foundCampground){
		if(err){
			req.flash("error","Campground not found")
			res.redirect("back");
		}
		else{
				//is user logged in?
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}
			//here foundCampground.author.id is an object while req.user._id is a string
			else{
				req.flash("error","You don't have permission to do that");
				res.redirect("back");

			}
		}
	})
	
	}else{
		req.flash("error","You need to be logged in to do that")
		res.redirect("back");
	}
}


middlewareObj.checkCommentOwnership=function(req,res,next){
	
	if(req.isAuthenticated()){
		// does user own the comment?
		Comment.findById(req.params.comments_id,function(err,foundComment){
		if(err){
			
			res.redirect("back");
		}
		else{
				//is user logged in?
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}
			//here foundCampground.author.id is an object while req.user._id is a string
			else{
						req.flash("error","You don't have permission to do that")
						res.redirect("back");

			}
		}
	})
	
	}else{
			req.flash("error","You need to be logged in to do that")
			res.redirect("back");
	}
}
middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");//This wont display anything yet. this data will be passed into app.js. from app.js it can be used in any routes without the need to be defined
	res.redirect("/login");
	
}

module.exports=middlewareObj