const express=require('express');
const router=express.Router();
const user=require('../controller/userController');
router.route('/').get(user.getAllUsers).post(user.createUser);
router.route('/:id').get(user.getUser).patch(user.updateUser).delete(user.deleteUser);

module.exports=router;