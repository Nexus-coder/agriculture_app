const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash')
const session = require('express-session')

//Here I have started a local instance of express                                                                                                                                                                   	
const app = express();
const ejsMate = require("ejs-mate");
const User = require('./models/user.model.js'); // Replace with your user model path

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


//this is the port it is currently on
const PORT = process.env.PORT || 3000;

// Connection URI (replace with your details)
const uri = "mongodb://localhost:27017/test-agriculture";
const productionUrl = "mongodb+srv://kimani:ISETbQb48ro0QQOJ@cluster0.hbs3wtk.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process on connection failure
    }

    app.listen(PORT, () => {
        console.log("The app is connect on port 3000")
    })
}

// Use connectDB() in your application (e.g., app.js)
connectDB();

// Close the connection when the application exits (optional)
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

app.use(session({
    secret: 'myapp',
    saveUninitialized: true,
    resave: true
}));


app.use(flash())

//set the value in flash to the rest of the pages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    console.log('This is the flash stored',req.flash("success"))
    console.log(res.locals.success)
    res.locals.error = req.flash("error");
    next();
});

app.get('/', (req, res) => {
    res.render('homepage/landing')
})

app.get('/register', (req, res) => {
    res.render('user/sign-up')
})

app.get('/login', (req, res) => {
    res.render('user/login')
})

app.get('/products', (req, res) => {
    res.render('store/products')
})

app.get('/create-store', (req, res) => {
    res.render('store/create')
})



app.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    const saltRounds = 10; // Adjust as needed (higher = more secure, but slower)

    async function hashPassword(password) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        req.flash('success', 'Successfully Signed Up');
        res.redirect('/login')
    } catch (error) {
        console.error(error);
        req.flash('error', error);
        res.redirect('/register')
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }); // Replace with your user model method

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // User successfully logged in (create a session or JWT token here)
            req.flash('success', 'Successfully Logged In')
            res.redirect('/products')
        } else {
            req.flash('error', 'Invalid Username or Password')
            res.redirect('/login')
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

