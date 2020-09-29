var express=require("express");
var router=express.Router({mergeParams:true});//This will merger params campgrounds(id) and comments
var Campgrnd=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware")

// ===============================
//COMMENTS ROUTES
// ===============================
//Comments new
router.get("/new",middleware.isLoggedIn, function(req,res){
	//We have here used the concept of nested routes, U can see here we have not created a seperate route for        /campgrounds/:id/comments but the data of the form is posted back to /campgrounds/:id/comments
	Campgrnd.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err)
		}
		else{
		
			res.render("comments/new", {campground:campground});
		}	
	})
});
//Comments Create
router.post("/",middleware.isLoggedIn, function(req,res){
	Campgrnd.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
			}
		else{
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					req.flash("error","something went wrong");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();//req.user contains two pieces of info i.e ID and the username
					//save comment
					campground.comments.push(comment);
					campground.save();
					
					req.flash("success","Successfully added a comment");
					res.redirect("/campgrounds/"+ campground._id);
				}
			})
			
		}
	});
});
//COMMET EDIT RoUTES
router.get("/:comments_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comments_id,function(err,foundComments){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id:req.params.id,comment:foundComments});
		}
	})
	
});
//UPDATE COMMENTS
router.put("/:comments_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comments_id,req.body.comment,function(err,updatedComments){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//COMMENT DESTROY ROUTE
router.delete("/:comments_id",middleware.checkCommentOwnership,function(req,res){
	//findBYidAndRemove
	Comment.findByIdAndRemove(req.params.comments_id,function(err){
		if(err){
			res.redirect("back");
		}else{
					req.flash("success","Comment deleted");
					res.redirect("/campgrounds/"+req.params.id);
		}
	});
});



module.exports=router;