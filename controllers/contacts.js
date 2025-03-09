const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); 

const getAll = async (req, res) => {
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
    try {
        const { id } = req.params;

        // Validating ObjectId before querying the database
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

module.exports = {
    getAll,
    getSingle
};
