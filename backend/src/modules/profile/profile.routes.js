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
    const userId = parseInt(req.params.id);
    console.log(`📝 Fetching profile for ID: ${userId}`);
    
    const profile = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      console.log(`❌ Profile not found for ID: ${userId}`);
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log(`✅ Profile found for ID: ${userId}`);
    res.json(profile);
  } catch (error) {
    console.error('❌ Profile fetch error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

module.exports = router;