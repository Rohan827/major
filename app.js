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

// Index route

app.get("/listings", async(req,res)=>{
  const alllistings = await Listing.find({});
  res.render("./listings/index.ejs",{alllistings});


})
// new and create

app.get("/listings/new",(req,res)=>{

    res.render("./listings/new.ejs");

});

app.post("/listings" ,async (req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("listings");
    console.log(newlisting);
})

// edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

// Show route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs" ,{listing});
 

});

app.put("/listings/:id", async (req,res)=>{
    let {id}  = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
});

// Delete route

app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");
})

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







app.listen(8080,()=>{
    console.log("server listening to port 8080");
})