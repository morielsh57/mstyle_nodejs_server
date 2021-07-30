const express = require('express');
const router = express.Router();
const { authToken,authAdminToken } = require('../middlewares/auth');
const userController = require('../controllers/userController');


router.get('/', (req, res)=>{
  res.json({message:"users router"});
});

router.post('/', userController.createUser);

router.post('/login', userController.loginUser);

router.post("/checkAdmin",authToken,authAdminToken, userController.checkIfAdmin);

router.get('/usersList',authToken,authAdminToken, userController.usersList);

router.get('/count',authToken,authAdminToken, userController.userAmount);

router.get('/single/:id', userController.singleUser);

router.get("/myInfo",authToken , userController.userInfo);

router.get("/customerAmount",authToken, authAdminToken , userController.customersAmount);

router.delete("/:id", authToken, authAdminToken , userController.deleteUser);

router.put("/:id", authToken, authAdminToken, userController.editUser);

router.post("/:role",authToken,authAdminToken, userController.createUserAsAdmin);

module.exports = router;