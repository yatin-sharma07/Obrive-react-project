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

    // Build update data object, only including fields that are provided
    const updateData = {
      name: fullName,
    };

    if (jobTitle !== undefined && jobTitle !== '') updateData.jobTitle = jobTitle;
    if (department !== undefined && department !== '') updateData.department = department;
    if (phoneNumber !== undefined && phoneNumber !== '') updateData.phoneNumber = phoneNumber;
    
    // Handle joinDate - convert string to Date if provided
    if (joinDate !== undefined && joinDate !== '') {
      try {
        let dateObj = new Date(joinDate);
        
        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
          // Try parsing dd-mm-yyyy format
          const parts = joinDate.split('-');
          if (parts.length === 3) {
            // Could be dd-mm-yyyy or yyyy-mm-dd
            const [part1, part2, part3] = parts;
            if (part1.length === 4) {
              // yyyy-mm-dd format
              dateObj = new Date(`${part1}-${part2.padStart(2, '0')}-${part3.padStart(2, '0')}`);
            } else {
              // dd-mm-yyyy format
              dateObj = new Date(`${part3}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`);
            }
          }
        }
        
        if (!isNaN(dateObj.getTime())) {
          updateData.joinDate = dateObj;
        }
      } catch (e) {
        console.error('Error parsing joinDate:', joinDate);
        updateData.joinDate = null;
      }
    }
    
    if (biography !== undefined && biography !== '') updateData.biography = biography;

    const profile = await prisma.users.update({
      where: { email },
      data: updateData,
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