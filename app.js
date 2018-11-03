var expressSanitizer    =   require("express-sanitizer"),
    methodOverride      =   require("method-override"),
    bodyParser          =   require("body-parser"),
    mongoose            =   require("mongoose"),
    express             =   require("express"),
    app                 =   express();
    
//APP CONFIG
mongoose.connect("mongodb://localhost/movie_app", { useNewUrlParser:true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE MODELING

var movieSchema = new mongoose.Schema({
   title: String,
   image: String,
   year: String,
   description: String,
created: {type: Date, default: Date.now}
});
var Movie = mongoose.model("Movie", movieSchema);



app.get("/", function(req, res){
    res.redirect("/movies");
});

//INDEX 

app.get("/movies", function(req, res){
    Movie.find({}, function(err, movies){
      if (err){
           console.log(err);
      } else{
          res.render("index", {movies: movies});
      }
    });
});


//NEW
app.get("/movies/new", function(req, res){
    res.render("new");
});

//CREATE
app.post("/movies", function(req, res){
    req.body.movie.description = req.sanitize(req.body.movie.description);
  Movie.create(req.body.movie, function(err, movie){
     if (err) {
         res.render("new")
     } else{
        res.redirect("/movies")
     }
  }); 
});

//SHOW
app.get("/movies/:id", function (req, res){
     Movie.findById(req.params.id, function(err, foundMovie){
      if (err){
           res.redirect("/movies");
      } else{
          res.render("show", {movie: foundMovie});
      }
    });
});

//EDIT
app.get("/movies/:id/edit", function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if (err){
            res.redirect("/movies")
        } else {
            res.render("edit", {movie: foundMovie}) 
        }
    });
});

//UPDATE
app.put("/movies/:id", function(req, res){
    req.body.movie.description = req.sanitize(req.body.movie.description);
  Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, fixedMovie){
     if (err) {
         res.redirect("/movies");
     } else{
        res.redirect("/movies/" + req.params.id);
     }
  }); 
});

//DELETE
app.delete("/movies/:id", function (req, res){
   Movie.findByIdAndRemove(req.params.id, function(err){
       if (err){
            res.redirect("/movies");
       } else {
            res.redirect("/movies"); 
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Movies ready, boss") 
});
