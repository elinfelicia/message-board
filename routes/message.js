const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', async (req, res) => {
  const messages = await prisma.message.findMany({
    include: { user: true },
  });
  res.json(messages);
});

router.post('/', authenticateToken, async (req, res) => {
  const { content } = req.body;
  const message = await prisma.message.create({
    data: {
      content,
      userId: req.userId,
    },
  });
  res.status(201).json(message);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const message = await prisma.message.updateMany({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
    data: { content },
  });
  if (message.count === 0) {
    return res.status(404).json({ error: 'Message not found or unauthorized' });
  }
  res.json(message);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const message = await prisma.message.deleteMany({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
  });
  if (message.count === 0) {
    return res.status(404).json({ error: 'Message not found or unauthorized' });
  }
  res.json({ message: 'Message deleted successfully' });
});

module.exports = router;
