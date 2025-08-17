
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {User} = require('../Model');
require('dotenv').config();

// register (normal users can sign up)

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password,address} = req.body;
        if(!name || !email || !password) return res.status(400).json({message:'Missing fields'});

        // basic validations (can be inproved)

        if(name.length <4) return res.status(400).json({message:'Name too short'});

        const existing = await User.findOne({where : {email}});
        if(existing) return res.status(400).json({message:'Email exists'});

        const user = await User.create({name,email,password,address});
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET);
        res.json({token,user:{id:user.id,name:user.name,email:user.email, role:user.role}})

    }catch(error){
        console.error(err);
        res.status(500).json({message:'server error'})

    }

});

// login 

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error); // ✅ fix here
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;