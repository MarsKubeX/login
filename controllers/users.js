const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * @swagger
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: Number
 *         email:
 *           type: string
 *     UserPartial:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     UsersArray:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/User'
 */

let controller = {
  /**
   * @swagger
   *
   * /users/{user_id}:
   *   get:
   *     summary: get a user by id
   *     operationId: readUser
   *     tags:
   *       - users
   *     parameters:
   *       - name: user_id
   *         in: path
   *         required: true
   *         description: the id of the user to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       '404':
   *         description: User not found
   *
   */

  getById: async (id, ctx, next) => {
    try {
      ctx.user = await User.findById(id).exec();
      if (!ctx.user) return (ctx.status = 404);
      return next();
    } catch (err) {
      ctx.status = 404;
    }
  },

  read: async ctx => {
    ctx.body = ctx.user.toClient();
  },

  /**
   * @swagger
   *
   * /users/:
   *   get:
   *     summary: list all users
   *     operationId: listUsers
   *     tags:
   *       - users
   *     responses:
   *       '200':
   *         description: success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UsersArray'
   *
   */
  list: async ctx => {
    const users = await User.find({}).exec();
    ctx.body = users;
  },
  /**
   * @swagger
   *
   * /signup/:
   *   post:
   *     summary: signup of a user
   *     operationId: signup
   *     tags:
   *       - signup
   *     responses:
   *       '200':
   *         description: success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/user'
   *
   */

  signup: async (ctx, next) => {
    const { username, email, password } = ctx.request.body;
    let user = await User.findOne({ email });
    if (user) {
      ctx.status = 400;
      ctx.body = 'User already exists!';
    } else {
      user = new User({
        username,
        email,
        password
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      ctx.body = {
        token: jwt.sign({ user: user.id }, 'secretWord', {
          expiresIn: 10000
        }),
        user: user.id
      };
    }
  }
};

module.exports = controller;
