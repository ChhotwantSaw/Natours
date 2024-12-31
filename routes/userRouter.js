const express=require('express');
const router=express.Router();
const user=require('../controller/userController');
const authUser=require('./../controller/authController');
const handleFactory=require('./../controller/handlerFactory');

router.post('/signup',authUser.signup);
router.post('/login',authUser.login);
router.post('/forgotPassword',authUser.forgotPassword);

router.use(authUser.protect);

router.patch('/resetPassword/:token',authUser.resetPassword);
router.patch('/updateMyPassword',authUser.updatePassword);
router.patch('/updateMe',user.updateMe);
router.delete('/deleteMe',authUser.protect,user.deleteMe);
router.route('/me').get(user.getMe,user.getUser);

router.use(authUser.restrictTo('admin'))

router.route('/').get(user.getAllUsers).post(user.createUser);
router.route('/:id').patch(user.updateUser).delete(user.deleteUser);

module.exports=router;