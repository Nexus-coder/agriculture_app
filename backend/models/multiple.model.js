const mongoose = require('mongoose');

const FarmerStoreSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  mushrooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mushroom',
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace with your store model name
    required: true, // Indicate a store is required
  },
});

const MushroomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  size: {
    type: String,
  },
  intendedUse: {
    type: String,
  }

});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: [{
    type: String,
    required: true,
  }],
});

mongoose.model('FarmerStore', FarmerStoreSchema);
mongoose.model('Mushroom', MushroomSchema);
mongoose.model('Product', ProductSchema);

module.exports = {
  FarmerStore: mongoose.model('FarmerStore'),
  Mushroom: mongoose.model('Mushroom'),
  Product: mongoose.model('Product'),
};
