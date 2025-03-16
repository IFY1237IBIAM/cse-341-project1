const express = require('express');
const router = express.Router();

const ContactsController = require('../controllers/contacts');

router.get('/', ContactsController.getAll);

router.get('/:id', ContactsController.getSingle)

// PART TWO PROJECT STARTS HERE
router.post('/', ContactsController.createContacts);

router.put('/:id', ContactsController.updateContacts);

router.delete('/:id', ContactsController.deleteContacts);

module.exports = router;