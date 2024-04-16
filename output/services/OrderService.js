const Order = require('../models/Order');

class OrderService {
  async createOrder(order) {
    const newOrder = new Order(order);
    await newOrder.save();
    return newOrder;
  }

  async getOrders() {
    const orders = await Order.find();
    return orders;
  }

  async getOrderById(id) {
    const order = await Order.findById(id);
    return order;
  }

  async updateOrder(id, order) {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, { new: true });
    return updatedOrder;
  }

  async deleteOrder(id) {
    await Order.findByIdAndDelete(id);
  }
}

module.exports = OrderService;