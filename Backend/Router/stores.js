const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { Store, Rating, User } = require('../Model');
const { auth, permit } = require('../middleware/auth');

// Create store (admin only)
router.post('/', auth, permit('admin'), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const s = await Store.create({ name, email, address, ownerId });
    res.json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// List stores (any authenticated user)
router.get('/', auth, async (req, res) => {
  try {
    const q = req.query.q || '';
    const where = q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { address: { [Op.like]: `%${q}%` } }
          ]
        }
      : {};

    const stores = await Store.findAll({ where });

    const results = [];
    for (const s of stores) {
      const avg = await Rating.findAll({
        where: { storeId: s.id },
        attributes: [
          [Rating.sequelize.fn('AVG', Rating.sequelize.col('score')), 'avg']
        ],
        raw: true
      });
      results.push({ store: s, avg: avg[0].avg || 0 });
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});


// Submit or update rating (user/admin)
router.post('/:id/rate', auth, permit('user', 'admin'), async (req, res) => {
  try {
    const score = parseFloat(req.body.score);
    if (!(score >= 1 && score <= 5))
      return res.status(400).json({ message: 'score must be 1-5' });

    const storeId = req.params.id;
    const existing = await Rating.findOne({ where: { storeId, userId: req.user.id } });

    if (existing) {
      existing.score = score;
      await existing.save();
      return res.json(existing);
    }

    const r = await Rating.create({ score, storeId, userId: req.user.id });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Get store ratings (owner/admin only)
router.get('/:id/ratings', auth, async (req, res) => {
  try {
    const storeId = req.params.id;
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'owner' && store.ownerId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    if (req.user.role === 'user')
      return res.status(403).json({ message: 'Forbidden' });

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Delete store (admin)
router.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: 'Not found' });

    await store.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
