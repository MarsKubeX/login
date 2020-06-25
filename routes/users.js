const users = require('../controllers/users');

module.exports = router => {
  router
    .param('user_id', users.getById)
    .post('/signup/', users.signup)
    .get('/users/', users.list);
};
