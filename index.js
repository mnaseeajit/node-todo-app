// console.log("hi");

// const express = require("express");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const mongodbSession = require("connect-mongodb-session")(session);
// const store = new mongodbSession({
//     uri: process.env.MONGO_URI,
//     collection: "sessions",
//   });

// const { userDataValidation, isEmailValidator } = require("./utils/authUtils");

// const User = require("./models/userModel");
// require("dotenv").config();
// const bcrypt = require("bcryptjs");
// const userModel = require("./models/userModel");

// console.log(`PORT: ${process.env.PORT}`);
// console.log(`MONGO_URI: ${process.env.MONGO_URI}`);

// const app = express();
// const PORT = process.env.PORT || 8000;
// const MONGO_URI = process.env.MONGO_URI;

// // Database connection
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("MongoDB connected successfully");
//     })
//     .catch((err) => {
//         console.error("MongoDB connection error:", err);
//     });

// // Middleware
// const isAuth = require('./middleware/isAuthMiddleware');
// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(
//     session({
//         secret : process.env.SECRET_KEY,
//         store : store,
//         resave : false,
//         saveUninitialized : false
//     })
// )

// app.get('/', (req, res) => {
//     console.log("home");
//     return res.send("server is running");
// });

// app.get('/test', (req, res) => {
//     console.log('test');
//     return res.send('test');
// });

// app.get('/register', (req, res) => {
//     return res.render('registerPage');
// });

// app.post('/register-user', async (req, res) => {
//     console.log('Register user request:', req.body);

//     const { name, email, username, password } = req.body;

//     // Data validation
//     try {
//         await userDataValidation({ name, email, username, password });
//     } catch (err) {
//         console.error('Validation error:', err.message);
//         return res.status(400).json({ status: 400, message: err.message });
//     }  

//     //find the user if alredy exist username or email 
//     const userEmailExist = await userModel.findOne({email});
//     if(userEmailExist){
//         return res.send({
//             statue : 400,
//             message : "email already exist",
//         })
//     }

//     const userNameExist = await userModel.findOne({username});
//     if(userNameExist){
//         return res.send({
//             statue : 400,
//             message : "username already exist",
//         })
//     }

//     const hashedPassword = await bcrypt.hash(
//         password,
//         parseInt(process.env.SALT)
//     );
//     console.log(hashedPassword);

//     const userObj = new User({
//         name : name ,
//         email : email,
//         username : username,
//         password : hashedPassword,
//     });

//     try {
//         const userDb = await userObj.save();
//         console.log('User registered:', userDb);
//         return res.redirect('/login');
        
//         return res.status(201).json({
//             status: 201,
//             message: "Register successful",
//             data: userDb,
//         });
//     } catch (err) {
//         console.error('Error saving user:', err.message);
//         return res.status(500).json({
//             status: 500,
//             message: "Internal server error",
//             error: err.message,
//         });
//     }
// });

// app.get('/login', (req, res) => {
//     return res.render('loginPage');
// });

// app.post('/login-user',async (req, res) => {
//     console.log(req.body);
//     const{loginId , password} = req.body;

//     if(!loginId || !password){
//         return res.status(400).json("missing login credential");
//     }

//     try{
//         //find the user with login id
//         let userdb;
//         if(isEmailValidator({str : loginId})){
//             userdb = await userModel.findOne({email : loginId});
//         }
//         else{
//             userdb = await userModel.findOne({username : loginId});
//         }

//         if (!userdb)
//         return res.status(400).json("User not found, please register first");
         
//         console.log(password , userdb.password);
//         //compare the password
//         const isMatch = await bcrypt.compare(password , userdb.password);
//         console.log(isMatch)
//         if(!isMatch){
//             return res.status(400).json("password not match");
//         }

//         //session base auth
//         console.log(req.session)
//         req.session.isAuth = true;
//         req.session.user={
//             userId : userdb._id.toString(),
//             email : userdb.email,
//             username : userdb.username
//         }

//         return res.redirect("dashbordPage");
//     }
//     catch(err){
//         return res.send({
//             status: 500,
//             message: "Internal server error",
//             error: err,
//         });
//     }
// });

// app.get('/dashbord',isAuth, async (req,res)=>{
//     return res.render('dashbordPage');
// })

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);
const { ObjectId } = require("mongodb");

//file-import
//const { userDataValidation, isEmailValidator } = require("./utils/authUtil");
const { userDataValidation, isEmailValidator } = require("./utils/authUtils");
const userModel = require("./models/userModel");
const todoModel = require('./models/todoModel');
const isAuth = require("./middleware/isAuthMiddleware");

//contants
const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlwares
app.set("view engine", "ejs"); //setting the view engine  of express to ejs
app.use(express.urlencoded({ extended: true })); //encoded data form
app.use(express.json()); //json
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDb connected successfully");
  })
  .catch((err) => console.log(err));

//api
app.get("/", (req, res) => {
  return res.send("Server is running");
});

//register
app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.post("/register-user", async (req, res) => {
  const { name, email, username, password } = req.body;
  console.log(req.body);
  console.log(req.sesssion);
  //data validation
  try {
    await userDataValidation({ name, email, username, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  //find the user if exist with email and username

  const userEmailExist = await userModel.findOne({ email });
  if (userEmailExist) {
    return res.send({
      status: 400,
      message: "Email already exist",
    });
  }

  const userUsernameExist = await userModel.findOne({ username });
  if (userUsernameExist) {
    return res.send({
      status: 400,
      message: "Username already exist",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );

  console.log(hashedPassword);

  //store the data in DB

  const userObj = new userModel({
    name: name,
    email: email,
    username: username,
    password: hashedPassword,
  });

  try {
    const userDb = await userObj.save();

    return res.redirect("/login");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

//login
app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.post("/login-user", async (req, res) => {
 console.log(req.body);
 console.log(req.session);

  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.status(400).json("Missing login credentials");

  try {
    //find the user with loginId
    let userDb;
    if (isEmailValidator({ str: loginId })) {
      userDb = await userModel.findOne({ email: loginId });
    } else {
      userDb = await userModel.findOne({ username: loginId });
    }

    if (!userDb)
      return res.status(400).json("User not found, please register first");

    //compare the password

    const isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) return res.status(400).json("Password does not matched");

    //session base auth
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id, //userDb._id.toString(), new ObjectId(userDb._id)
      email: userDb.email,
      username: userDb.username,
    };

    return res.redirect("/dashbord");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

//protected api
app.get("/dashbord", isAuth, (req, res) => {
  return res.render("dashbordPage");
});

app.post("/logout", (req, res) => {
  console.log("logout");

  req.session.destroy((err) => {
    if (err) return res.status(500).json(err);

    //successfully logout
    return res.redirect("/login");
  });
});

app.post('/create-item',isAuth,async (req,res)=> {
    console.log(req.body);
    console.log(req.session);

    const todoText = req.body.todo;
    const username = req.session.user.username;

    //data validation
    if(!todoText){
        return res.send({
            status : 400,
            message : 'missing todo text'
        })
    }
    if(typeof todoText !== 'string'){
        return res.send({
            status : 400,
            message : 'todo is not a text'
        })
    }

    //create an object
    const todoObj = todoModel({
        //schema : value 
        todo : todoText,
        username : username
    })

    try{
      const todoDb = await todoObj.save();
      return res.send({
         status : 201,
         message : "todo creates successfully",
         data : todoDb
      })
    }
    catch(error){
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error,
          });
    }
})

app.get('/read-item',async (req,res)=> {
     const username = req.session.user.username;
     const SKIP = Number(req.query.skip) || 0;
     const LIMIT = 5;

     try{
         //const todoDb = await todoModel.find({username : username})

         //mongo db aggregation , skip and limit
         const todoDb = await todoModel.aggregate([
           {
            $match : {username : username},
           },
           {
            $skip : SKIP,
           },
           {
             $limit : LIMIT,
           }
           
         ]) 
         console.log(todoDb);

         if(todoDb.length === 0){
            return res.send({
                status : 204,
                message : "no todo found"
            })
         }
         return res.send({
            status : 200,
            message : "todo Read successfully",
            data : todoDb
         })
     }
     catch(error){
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error,
          });
     }
})

app.post('/edit-item',isAuth,async (req,res)=> {
     const newData = req.body.newData;
     const todoId = req.body.todoId;
     const usernameReq = req.session.user.username;

     console.log(newData , todoId);

     if(!todoId){
        return res.send({
            status : 400,
            message : 'missind todo id'
        })
     }

     if(!newData){
        return res.send({
            status : 400,
            message : 'missind todo text'
        })
     }

     if(typeof newData !== 'string'){
        return res.send({
            status : 400,
            message : 'todo is not a text'
        })
     }

     //ownership check
     try{
        //find the todo from db
        const todoDb = await todoModel.findOne({_id : todoId})
        console.log(todoDb , usernameReq);

        if(todoDb.username !== usernameReq){
            return res.send({
                status : 403,
                message : 'not allow to edit the todo'
            })
        }

        const prevDataDb = await todoModel.findOneAndUpdate({_id: todoId},{todo : newData})

        return res.send({
            status : 200,
            message : "todo update successfully",
            data : prevDataDb
        })
     }
     catch(error){
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error,
          });
     }
})

app.post('/delete-item',isAuth ,async (req,res)=> {
    const todoId = req.body.todoId;

    const usernameReq = req.session.user.username;

    if (!todoId) {
      return res.send({
        status: 400,
        message: "Missing todo id",
      });
    }

    try {
      //find the todo from db
      const todoDb = await todoModel.findOne({ _id: todoId });
      console.log(todoDb.username, usernameReq);
  
      //ownership check
      if (todoDb.username !== usernameReq) {
        return res.send({
          status: 403, //forbidden
          message: "Not allowed to delete the todo",
        });
      }
  
      const prevDataDb = await todoModel.findOneAndDelete({ _id: todoId }); //deleteOne()
  
      return res.send({
        status: 200,
        message: "Todo deleted successfully",
        data: prevDataDb,
      }); 
    } 
    catch (error) {
        return res.send({
          status: 500,
          message: "Internal server error",
          error: error,
        });
      }
 });


app.listen(PORT, () => {
  console.log(`Server is running at:`);
  console.log(`http://localhost:${PORT}`);
});