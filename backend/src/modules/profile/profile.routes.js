const express = require('express');
const router = express.Router();
const { prisma } = require('../../config/db');

// Save/Update Profile
router.post('/', async (req, res) => {
  try {
    const { fullName, email, jobTitle, department, phoneNumber, joinDate, biography } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full Name and Email are required' });
    }

        const profile = await prisma.users.update({
        where: { email },
        data: {
            name: fullName,
            jobTitle,             
            department,
            phoneNumber,           
            joinDate,              
            biography,
        },
        });

    res.json({
      success: true,
      message: 'Profile saved successfully',
      profile,
    });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get Profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await prisma.users.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;