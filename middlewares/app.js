const express = require("express");
const app = express();

const ExpressError = require("./ExpressError");

/* app.use((req,res,next)=>{
    console.log("hi i am a middleware");
    next();
}); */
// logger - morgan
// app.use((req,res,next) => {
//     req.time = new Date(Date.now()).toString();
//     console.log(req.method,req.hostname,req.time);
//     next();
// })

app.use("/api",(req,res,next) => {
    let {token} = req.query;
    if(token == "giveaccess"){
        next();
    }
    throw new ExpressError(401,"ACCESS DENIED!");

    
})
app.get("/api",(req,res) => {
    res.send("data");
}
)
app.use("/admin", (req,res,next) => {
    let{user} = req.query;
    if(user == "rohan"){
    next();
    }
    throw new ExpressError(403,"Forbidden");
})

app.get("/admin" , (req,res)=> {
    res.send(data);
})


app.get("/",(req,res)=>{
    res.send("working");
});

// app.get("/random", (req,res) =>{
//     res.send("this is a random page");
// });

//404
// app.use((req,res)=>{
//     res.send("page not found!")

// }
// )
app.get("/err", (req,res) => {
abcd = abcd;
})

app.use((err,req,res,next) =>{
    let {status = 500,message} = err;
    res.status(status).send(message);
})



app.listen(8080,()=>{
    console.log("listening to port 8080");
})