const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', (req, res)=>{
  res.json({message:"users router"});
});

router.post('/', userController.createUser);

router.post('/login', userController.loginUser);


module.exports = router;