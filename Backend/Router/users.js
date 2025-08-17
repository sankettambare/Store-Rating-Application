
const express = require('express');

const router = express.Router();

const {User,Rating,Store} = require('../Model');

const {auth,permit} = require('../middleware/auth');

// admin create user (admin or owner)

router.post('/',auth,permit('admin'),async(req,res)=>{
    try{
        const {name,email,password,address,role} = req.body;
        const u = await User.create({name,email,password,address,role});
        res.json(u);

    }catch(err){
        console.log(err);
        res.status(500).json({message:'server error'});
    }

})

// get all user (admin)
router.get('/',auth,permit('admin'),async(req,res)=>{
    const users = await User.findAll({attributes:['id','name','email','address','role']})
    res.json(users)
})


// get profile
router.get('/me',auth,async(req,res)=>{
    const user = req.body;
    res.json({id:user.id, name:user.name,email:user.email,address:user.address,role:user.role})

});
 
// update password
router.put('/me/password',auth,async(req,res)=>{
    const {password}= req.body;

    if(!password) return res.status(400).json({message:'Password required'});
    req.user.password = password;
    await req.user.save();
    res.json({message:'Password updated'});
});


// view one user details (admin) - includes rating if owner

router.get('/:id',auth,permit('admin'),async(req,res)=>{
    const user = await User.findByPk(req.params.id,{attributes:['id','name','email','address','role']})
       if(!user) return res.status(404).json({message:'not found'});
       let extra = {};
      if(user.role ==='owner'){
        // find owners store average rating
        const stores = await Store.findAll({where:{ownerId:user.id}})
      
      // compute ratings per store

      const results = [];

      for(const s of stores){
        const avg = await Rating.findAll({where:{storeId: s.id},attributes:[[Rating.sequelize.fn('AVG',Rating.sequelize.col('score')),'avg']]});
        results.push({ store: s, avg: avg[0].dataValues.avg });
      }
      extra.stores = results;

      }
      res.json({user,extra});
})


module.exports = router