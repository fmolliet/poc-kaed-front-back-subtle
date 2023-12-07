const { Router } = require('express');

const controller = require('./controller')

const routes = Router();

routes.post('/keys', controller.initialize)

module.exports = routes; 