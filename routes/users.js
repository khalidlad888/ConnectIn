const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users_controller');

console.log("Users router loaded");

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/chats', passport.checkAuthentication, usersController.chats);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);

router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);


router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports = router;