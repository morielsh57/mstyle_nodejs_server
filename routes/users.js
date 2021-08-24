const express = require('express');
const router = express.Router();
const { authToken,authAdminToken } = require('../middlewares/auth');
const userController = require('../controllers/userController');


router.get('/', (req, res)=>{
  res.json({message:"users router"});
});

router.post('/', userController.createUser);

router.post('/login', userController.loginUser);

router.get('/isCorrectPass/:pass', authToken, userController.isCorrectPass);

router.post("/checkAdmin",authToken,authAdminToken, userController.checkIfAdmin);

router.get('/usersList',authToken,authAdminToken, userController.usersList);

router.get('/count', userController.userAmount);

router.get('/single/:id',authToken, userController.singleUser);

router.get('/singleNameAvatar/:id', userController.singleNameAvatar);

router.get("/myInfo",authToken , userController.userInfo);

router.get("/customerAmount",authToken, authAdminToken , userController.customersAmount);

router.delete("/:id", authToken, authAdminToken , userController.deleteUser);

router.put("/editProfile/:id", authToken, userController.editUserProfile);

router.put("/:id", authToken, authAdminToken, userController.editUser);

router.post("/:role",authToken,authAdminToken, userController.createUserAsAdmin);

router.put("/upload/:editId", authToken,authAdminToken ,userController.upload);

module.exports = router;