const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo")
const multer = require('multer'); // For image upload handling
const upload = require('./utility/multer.js')
const { FarmerStore, Mushroom, Product } = require('./models/multiple.model.js'); // Assuming models are exported
const Order = require('./models/order.model.js')


//Here I have started a local instance of express                                                                                                                                                                   	
const app = express();

const ejsMate = require("ejs-mate");
const User = require('./models/user.model.js'); // Replace with your user model path

// Create necessary directories if not exist
const fs = require('fs');
const directories = ['./public', './public/mushrooms-images', './public/products'];
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use('/products', express.static("uploads"));


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
    resave: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/test-agriculture'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


app.use(flash())

app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    next();
});

//set the value in flash to the rest of the pages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    console.log('This is the flash stored', req.flash("success"))
    console.log(res.locals.success)
    res.locals.error = req.flash("error");
    next();
});

// Cart Class
class Cart {
    constructor() {
        this.items = [];
    }

    addItem(productId, quantity) {
        const existingItem = this.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ productId, quantity });
        }
    }

    getCartDataForSession() {
        return this.items.map(item => ({ productId: item.productId, quantity: item.quantity }));
    }
}
// const Cart = function (items) {
//     this.items = items || {};
//     this.addItem = function (productId, quantity) {
//         this.items[productId] = this.items[productId] || 0;
//         this.items[productId] += quantity;
//     };
//     this.removeItem = function (productId) {
//         delete this.items[productId];
//     };
//     // Add other cart functionalities like calculating total price, etc.
//     this.getTotalPrice = function (productData) { // Replace with your product data access logic
//         let totalPrice = 0;
//         for (const productId in this.items) {
//             const price = productData[productId].price || 0; // Replace with your price logic
//             const quantity = this.items[productId];
//             totalPrice += price * quantity;
//         }
//         return totalPrice;
//     };
// };


app.get('/', (req, res) => {
    res.render('homepage/landing')
})

app.get('/register', (req, res) => {
    res.render('user/sign-up')
})

app.get('/login', (req, res) => {
    res.render('user/login')
})

//Get the product page and populate it working
app.get('/products', async (req, res) => {
    const mushrooms = await Mushroom.find();
    const products = await Product.find();
    // res.json({ mushrooms, products });
    res.render('store/products', { mushrooms, products })
})

app.get('/create-store', (req, res) => {
    res.render('store/create')
})

app.get('/place-order', (req, res) => {
    const cart = req.session.cart || new Cart({});
    // res.render('cart', { cartItems: cart.items });
    res.render('store/place-order', { cart: cart })
})

app.get('/profile/edit', async (req, res) => {
    const farmer = await FarmerStore.findOne({ store: req.session.userId }).populate('mushrooms').populate('products'); // Replace with logic
    if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found' });
    }
    // res.json({ farmer })
    res.render('profile/edit', { farmer })
})

app.get('/profile', requireLogin, async (req, res) => {
    try {
        // Assuming farmer data is retrieved from session or authentication
        console.log(req.session.userId)
        const farmer = await FarmerStore.findOne({ store: req.session.userId }).populate('mushrooms').populate('products'); // Replace with logic
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        // res.json({ farmer })
        res.render('profile/profile', { farmer }); // Render profile.ejs template
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

const cart = new Cart({});
// Add item to cart
app.post('/cart/add', (req, res) => {
    // Inside the `/cart/add` route handler:

    let cartData = req.session.cart || []; // Initialize with empty array if not set

    const productId = req.body.productId;
    const price = req.body.price || 1;
    const name = req.body.name

    const existingItem = cartData.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.price += price;
    } else {
        cartData.push({ productId, price, name });
    }

    req.session.cart = cartData;

    res.json({ message: 'Item added to cart', cart: req.session.cart });

});

app.post('/orders', (req, res) => {
    const orderData = req.body; // Access the entire order object from the request body
    console.log("This is the order data", orderData)
    // Validate order data (optional)
    // ...

    const newOrder = new Order(orderData);
    newOrder.customer = req.session.userId;
    newOrder.save()
        .then(() => {
            console.log('Order saved successfully!');
            res.json({ message: 'Order submitted successfully!' }); // Send confirmation response
        })
        .catch(err => {
            console.error('Error saving order:', err);
            res.status(500).json({ message: 'Error submitting order!' }); // Send error response
        });
});

// View cart contents
app.get('/cart', (req, res) => {
    const cart = req.session.cart || new Cart({});
    res.render('cart', { cartItems: cart.items }); // Replace with your view rendering logic
});

// Update cart quantity (example)
app.post('/cart/update/:productId', (req, res) => {
    const productId = req.params.productId;
    const newQuantity = req.body.quantity;

    if (req.session.cart) {
        req.session.cart.items[productId] = newQuantity;
    }

    res.json({ message: 'Cart updated successfully' });
});

// Remove item from cart
app.post('/cart/remove/:productId', (req, res) => {
    const productId = req.params.productId;

    if (req.session.cart) {
        req.session.cart.removeItem(productId);
    }

    res.json({ message: 'Item removed from cart' });
});

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

        req.session.userId = savedUser._id; // Create session
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
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // User successfully logged in (create a session or JWT token here)
            req.session.userId = user._id; // Create session
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

app.get('/logout', (req, res) => {
    if (req.session) {
        // Clear user-specific session data
        req.session.userId = null;

        req.flash('success', 'Successfully Logged Out');
        res.redirect('/login'); // Redirect to the login page or home page
    } else {
        req.flash('error', 'No session found.');
        res.redirect('/login');
    }
});


// Middleware to protect routes
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect('/login');
    }
    next();
}


// const upload = multer({ dest: 'uploads/' }).array(); // Configure upload directory

app.post('/store/create', requireLogin, upload, async (req, res) => {
    console.log('This is the file', req.file)
    console.log("This are the files", req.files)
    try {

        console.log("this is the request body", req.body)

        // Extract farmer store information
        const { storeName } = req.body;

        // Create a new farmer store
        const farmerStore = new FarmerStore({ storeName });
        //Associate the store created to the current logged in user
        farmerStore.store = req.session.userId;

        const { type, size, use: intendedUse } = req.body;
        const images = req.files['mushrooms-images'].map(file => file.filename);
        // Create a new mushroom document
        const mushroom = new Mushroom({ type, images, size, intendedUse });

        // Associate the mushroom with the farmer store
        farmerStore.mushrooms.push(mushroom);

        // Save the mushroom
        await mushroom.save();


        const { product_name: name, product_description: description, product_price: price } = req.body;
        let image = req.files.products.map(file => file.filename);
        // Create a new product document
        const product = new Product({ name, description, price, image });

        // Associate product with the mushroom
        farmerStore.products.push(product);

        // Save the product
        await product.save();

        // Save the farmer store with associated mushrooms and products
        await farmerStore.save();

        req.flash('success', 'Successfully Created a Store')
        res.redirect('/products')

    } catch (error) {
        console.error(error);
        req.flash('error', 'Cannot make the store')
        res.redirect('/create-store')
    }
});

app.put('/store/update', requireLogin, upload, async (req, res) => {
    console.log('This is the file', req.file);
    console.log('This are the files', req.files);
  
    try {
      const { storeId } = req.params; // Assuming you have a store ID in the route parameters
  
      // Find the farmer store to update
      const farmerStore = await FarmerStore.findById(storeId);
  
      if (!farmerStore) {
        req.flash('error', 'Store not found!');
        return res.redirect('/products'); // Handle case where store isn't found
      }
  
      // Update farmer store information (if provided in the request body)
      if (req.body.storeName) {
        farmerStore.storeName = req.body.storeName;
      }
  
      // Update mushroom data (if provided)
      const { type, size, use: intendedUse } = req.body;
      const imageUpdates = []; // Track updates for mushroom images
  
      if (req.files['mushrooms-images']) {
        const newImages = req.files['mushrooms-images'].map(file => file.filename);
        farmerStore.mushrooms.forEach(mushroom => {
          // Update existing images if provided in the request body
          if (req.body[`mushroom-image-${mushroom._id}`]) {
            const updatedImage = req.body[`mushroom-image-${mushroom._id}`];
            mushroom.images.find(img => img === updatedImage) ? null : mushroom.images.push(updatedImage);
            imageUpdates.push({ _id: mushroom._id, image: updatedImage }); // Track updates for later saving
          }
        });
        farmerStore.mushrooms = farmerStore.mushrooms.concat(newImages.map(image => ({ type, images: [image], size, intendedUse })));
      }
  
      // Update product data (if provided)
      const { product_name: name, product_description: description, product_price: price } = req.body;
      let image = req.files.products ? req.files.products.map(file => file.filename) : []; // Check for new product image
  
      if (req.body.productId) { // Update existing product
        const existingProduct = farmerStore.products.find(prod => prod._id.toString() === req.body.productId);
        if (existingProduct) {
          existingProduct.name = name;
          existingProduct.description = description;
          existingProduct.price = price;
          if (image.length) {
            existingProduct.image = image[0]; // Update product image if provided
          }
        }
      } else { // Create new product
        const newProduct = new Product({ name, description, price, image });
        farmerStore.products.push(newProduct);
      }
  
      // Save the updated farmer store with associated mushrooms and products
      await farmerStore.save();
  
      // Save any individual mushroom image updates outside the loop
      imageUpdates.forEach(async update => {
        const mushroomToUpdate = farmerStore.mushrooms.find(m => m._id.toString() === update._id);
        if (mushroomToUpdate) {
          mushroomToUpdate.images = update.image ? mushroomToUpdate.images.concat(update.image) : mushroomToUpdate.images;
          await mushroomToUpdate.save();
        }
      });
  
      req.flash('success', 'Successfully Updated Store');
      res.redirect('/products');
  
    } catch (error) {
      console.error(error);
      req.flash('error', 'Failed to update store!');
      res.redirect('/products');
    }
  });
  
