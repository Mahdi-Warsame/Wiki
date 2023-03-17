const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
const articlesSchema = mongoose.Schema({
	title: String,
	content: String
});

const Article = mongoose.model("Article", articlesSchema);

///////// Handling requests targetting all articles///////////////////

app.route("/articles")
	.get(function(req, res){
		Article.find().then(function(foundArticles){
			res.send(foundArticles);
		}).catch(function(err){
			res.send(err);
		});
	})
	.post(function(req, res){
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content
		});
		newArticle.save().then(function(){
			res.send("Successfully added new article");
		}).catch(function(err){
			res.send(err);
		});
	})
	.delete(function(req, res){
		Article.deleteMany().then(function(){
			res.send("Successfully deleted all articles"); 
		}).catch(function(err){
			res.send(err);
		});
	});

///////// Handling requests targetting a specific articles///////////////////

app.route("/articles/:articleName")
	.get(function(req, res){
		const requestedArticle = req.params.articleName;
		Article.findOne({title:requestedArticle}).then(function(foundAticle){
			res.send(foundAticle);
		}).catch(function(err){
			res.send(err);
		});

	})
	.put(function(req, res){
		Article.findOneAndReplace(
			{title:req.params.articleName},
			{title:req.body.title,
			content:req.body.content},{overwrite:true}).then(function(){
				res.send("Successfully updated article");
			})
		.catch(function(err){
				res.send(err);
			});
	})
	.patch(function(req, res){
		Article.findOneAndUpdate({title:req.params.articleName},
			{$set:req.body}).then(function(){
				res.send("Article updated Successfully");
			}).catch(function(err){
				if(err){
					res.send(err);
				}
			});
	})
	.delete(function(req, res){
		Article.deleteOne({title:req.params.articleName}).then(function(){
			res.send("Successfully deleted article");
		}).catch(function(err){
			if(err){
				res.send(err);
			}
		});
	});

app.listen(3000, function(){
	console.log("app is running on port 3000")
});
