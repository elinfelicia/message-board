const express = require('express');
const app = express();
const prisma = require('./prisma/client'); 
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const dotenv = require('dotenv');

dotenv.config();
app.use(express.json());


app.use(express.static('public'));

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
