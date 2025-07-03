const { validateLogin, validateSignup } = require('../validation/validation');
const { User, Login, Conversation } = require ('../models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

exports.signUp = async (req, res) => {
    const { error } = validateSignup(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }

    const {name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    try {
        const existingUser = await User.findOne({ where: {email: email} });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        await User.create({
            id: userId,
            name: name,
            email: email,
            password: hashPassword
        });

        res.status(201).json({ message: 'User created'});
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json ({ error: error.details.map(err => err.message) });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return res.status(401).json({ error: 'Invalid User'});
    }
    const hashPassword = await bcrypt.compare(password, user.password);
    if (!hashPassword) {
        return res.status(401).json({ error: 'Invalid Password'});
    }
    try {
        const sessionId = uuidv4();
        await Login.create({
            id: sessionId,
            user_id: user.id
        })
        res.status(200).json({ message: 'Login successful', sessionId: sessionId});
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login error' });
    }
};

exports.logout = async (req, res) => {
    const sessionId = req.headers['x-auth-token'];
    if (!sessionId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const session = await Login.findOne({ where: { id: sessionId } });
        if (!session) {
            console.log('Session not found:', sessionId);
            return res.status(404).json({ error: 'Session not found' });
        }
        await Login.destroy({ where: { id: sessionId } });
        console.log('Session destroyed:', sessionId);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ id: user.id, name: user.name});
    } catch (error) {
        console.log('Get user error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { id: { [Op.ne]: req.user } },
            attributes: ['id', 'name']
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getOrCreateConversationId = async (req, res) => {
    const user_one_id = req.user;
    const {user_two_id} = req.body;

    if (!user_one_id || !user_two_id) {
        res.status(400).json({ error: 'Missing user id'});
    }

    try {
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    {user_one_id, user_two_id},
                    {'user_one_id': user_two_id, 'user_two_id': user_one_id},
                ]
            }
        });

        if (!conversation){
            conversation = await Conversation.create({
                'user_one_id': user_one_id,
                'user_two_id': user_two_id
            });
        }
        res.json({'conversationID': conversation.id});
    } catch (error) {
        console.error('Error in getOrCreateConversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
