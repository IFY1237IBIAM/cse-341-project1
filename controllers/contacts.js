const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); 

const getAll = async (req, res) => {
    //#swagger.tags=['Contacts']
    try {
        const db = mongodb.getDatabase();
        const contacts = await db.collection('Contacts').find().toArray(); 
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};

const getSingle = async (req, res) => {
     //#swagger.tags=['Contacts']
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const db = mongodb.getDatabase();
        const contact = await db.collection('Contacts').findOne({ _id: new ObjectId(id) });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Error fetching contact', error: error.message });
    }
};

const createContacts = async (req, res) => {
     //#swagger.tags=['Contacts']
    try {
        const Contacts = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };

        const db = mongodb.getDatabase();
        const response = await db.collection('Contacts').insertOne(Contacts);

        if (response.acknowledged) {
            res.status(201).json({ message: 'Contact created successfully', id: response.insertedId });
        } else {
            res.status(500).json({ message: 'Error creating contact' });
        }
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Error creating contact', error: error.message });
    }
};

const updateContacts = async (req, res) => {
     //#swagger.tags=['Contacts']
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const ContactsId = new ObjectId(id);
        const Contacts = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };

        const db = mongodb.getDatabase();
        const response = await db.collection('Contacts').replaceOne({ _id: ContactsId }, Contacts);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Contact updated successfully' });
        } else {
            res.status(404).json({ message: 'Contact not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};

const deleteContacts = async (req, res) => {
     //#swagger.tags=['Contacts']
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const ContactsId = new ObjectId(id);
        const db = mongodb.getDatabase();
        const response = await db.collection('Contacts').deleteOne({ _id: ContactsId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Contact deleted successfully' });
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContacts,
    updateContacts,
    deleteContacts
};
