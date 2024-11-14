const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
const methodOverride = require("method-override");
app.use(methodOverride('_method'));
const Listing = require("./Models/listing.js");
const ejsMate = require('ejs-mate');
app.engine('ejs',ejsMate);
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
// database connection
main().then((res)=>{
    console.log("connection successful");
}).catch((err) =>{
    console.log(err);

})
async function main(){
    await mongoose.connect(mongo_url);
}

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);

    console.log(result);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

// Index route

app.get("/listings",wrapAsync( async(req,res)=>{
  const alllistings = await Listing.find({});
  res.render("./listings/index.ejs",{alllistings});


}))
// new and create

app.get("/listings/new",(req,res)=>{

    res.render("./listings/new.ejs");

});

app.post("/listings",validateListing ,wrapAsync(async (req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
    const newlisting = new Listing(req.body.listing);
    
    await newlisting.save();
    res.redirect("listings");
    console.log(newlisting);
   
}))

// edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))

// Show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs" ,{listing});
 

}));

app.put("/listings/:id",validateListing,wrapAsync( async (req,res)=>{

    let {id}  = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

// Delete route

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");
}))

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"my new villa",
//         description:"buy the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });

//    await sampleListing.save();
//    console.log("sample was saved")
//     res.send("success");
// });

app.all("*", (req,res,next) =>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode= 500,message = "something went wrong"} = err;


    res.status(statusCode).render("error.ejs", {message});
});




app.listen(8080,()=>{
    console.log("server listening to port 8080");
})