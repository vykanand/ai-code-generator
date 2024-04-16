const Product = require('../models/Product');

class ProductService {
  async createProduct(product) {
    const newProduct = new Product(product);
    await newProduct.save();
    return newProduct;
  }

  async getProducts() {
    const products = await Product.find();
    return products;
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    return product;
  }

  async updateProduct(id, product) {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    return updatedProduct;
  }

  async deleteProduct(id) {
    await Product.findByIdAndDelete(id);
  }
}

module.exports = ProductService;