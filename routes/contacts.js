const express = require('express');
const router = express.Router();

const ContactsController = require('../controllers/contacts');

router.get('/', ContactsController.getAll);

router.get('/:id', ContactsController.getSingle)

module.exports = router;