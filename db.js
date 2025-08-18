/** Database setup for BizTime. */
// Destructuring the required modules from pg 
const { Client } = require('pg');

let DB_URI;

// Check if the environment is production or development
if (process.env.NODE_ENV === 'test') {
    DB_URI = 'postgresql:///biztimedb_test';
} else {
    DB_URI = 'postgresql:///biztimedb';
}

// Create a new client instance with the database URI
const db = new Client({
    connectionString: DB_URI,
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

// Export the db client for use in other modules
module.exports = db;

