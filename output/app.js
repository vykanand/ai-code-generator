const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const helmet = require('helmet');

app.use(cors());
app.use(helmet());

app.use(express.json());

const friendRouter = require('./routes/friend.routes');
const reviewRouter = require('./routes/review.routes');
const postRouter = require('./routes/post.routes');
const likeRouter = require('./routes/like.routes');
const orderRouter = require('./routes/order.routes');
const productRouter = require('./routes/product.routes');

app.use('/api/friends', friendRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/posts', postRouter);
app.use('/api/likes', likeRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});