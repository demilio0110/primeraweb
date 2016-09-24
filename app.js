var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var app_password = "123";

cloudinary.config({
	cloud_name: "dpdumi9oo2",
	api_key: "881582474559813",
	api_secret: "rVBhJWxCDA-_IiGD7U92l1YpH0A"
});

var app = express();

mongoose.connect("mongodb://localhost/primera_pagina");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var uploader = multer({dest: "./uploads"});

var middleware_upload = uploader.single('image_avatar');

//Definir esquema de nuestros productos
var productSchema = {
	title: String,
	description: String,
	imageUrl: String,
	pricing: Number
};

var Product = mongoose.model("Product", productSchema);

app.set("view engine", "jade");

app.use(express.static("public"));

app.get("/", function(solicitud,respuesta){

	/*var data = {
		title : "mi primer producto",
		description : "sjdjasd",
		imageUrl : "data.png",
		pricing : 22
	}

	var product = new Product(data);

	product.save(function(err){
		console.log(product);
	});
	*/
	respuesta.render("index");

});

app.get("/menu", function(solicitud, respuesta){
	respuesta.render("menu/new");
});

app.post("/admin", function(solicitud, respuesta){
	if(solicitud.body.password == app_password){

	}else{
		respuesta.redirect("/");
	}
});

app.get("/admin", function(solicitud, respuesta){
	respuesta.render("admin/form");
});


app.post("/menu", function(solicitud, respuesta){

	if(solicitud.body.password == app_password){
		var data = {
			title: solicitud.body.title,
			descripcion:solicitud.body.description,
			imageUrl:"data.png",
			pricing: solicitud.body.pricing
		}

		var product = new Product(data);
		//if (solicitud.files){
			cloudinary.uploader.uploads(solicitud.files.image_avatar.path, function(result){
				product.imageUrl = result.url;
				product.save(function(err){
					console.log(product);
					respuesta.render("index");
				});
			});
		//};
	}else{
		respuesta.render("menu/new");
	};
});

app.get("/menu/new", function(solicitud, respuesta){

	respuesta.render("menu/new")
})

app.listen(8080);