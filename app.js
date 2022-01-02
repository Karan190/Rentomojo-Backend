if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const contactRoute=require('./routes/contact.js');
const userRoute=require('./routes/user.js')
const MongoStore= require('connect-mongo');

const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/phonebook';
//process.env.DB_URL
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).
then(()=>{
    console.log("db connected");
}).
  catch(error => console.log(error));

const app=express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
const secret = process.env.SECRET || "notagoodone";
const store=  MongoStore.create({
    mongoUrl:dbUrl,
    secret,
    touchAfter: 24 * 3600
})

store.on("error",function(e){
    console.log("session store Error!!",e);
})
let sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.user=req.session.userid;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.use('/',contactRoute);
app.use('/',userRoute);
app.get('*',(req,res,next)=>{
    //req.flash('error','Does not exist');
    res.redirect('/');
})

const port=process.env.PORT || 3000;
app.listen(port,()=>
{
    console.log(`Server is  running on port ${port}`);
})