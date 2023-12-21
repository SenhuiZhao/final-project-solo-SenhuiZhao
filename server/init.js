//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.


// let userArgs = process.argv.slice(2);

// if (!userArgs[0].startsWith('mongodb')) {
//     console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
//     return
// }

// let User = require('./models/user');
// let Comment = require('./models/comments');
// let Tag = require('./models/tags');
// let Question = require('./models/questions');
// let Answer = require('./models/answers');


// let mongoose = require('mongoose');
// let mongoDB = userArgs[0];
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// // mongoose.Promise = global.Promise;
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// function adminUserCreate(username, email, password) {
//     adminUserDetail={
//         username: username,
//         email: email,
//         password: password
//     }

//     let adminUser = new User(adminUserDetail)
//     return adminUser.save();
// }

// const populate = async ()=>{
//     let adminUser = await adminUserCreate('zhao', 'senhui.zhao@gmail.com', '123456')
//     if(db) db.close();
//     console.log('done');
// }

// populate()
//   .catch((err) => {
//     console.log('ERROR: ' + err);
//     if(db) db.close();
//   });

// console.log('processing ...');

// Input from command line for the admin user

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/users');
console.log(process.argv)
const [adminUsername, adminPassword, mongoDBUrl, adminEmail] = process.argv.slice(2);
//node .\init.js zhao 123 mongodb://127.0.0.1:27017/fake_so zhao@gmail.com
console.log("adminUsername: ",adminUsername)
console.log("adminPassword: ",adminPassword)
console.log("mongoDBUrl: ",mongoDBUrl)
console.log("adminEmail: ",adminEmail)

if (!mongoDBUrl.startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log('here')
async function createAdminUser() {
    try {
        // Check if a user with the admin username already exists in the database
        const adminUser = await User.findOne({ username: adminUsername });
        if (adminUser) {
            console.log(`Admin user "${adminUsername}" already exists in the database`);
            return;
        }

        // Hash the admin password using bcrypt
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create a new user profile for the admin in the database
        const newAdminUser = new User({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
            reputation: 999  //For testing purposes, the administrator has the highest authority
        });
        await newAdminUser.save();

        console.log(`Admin user "${adminUsername}" created in the database`);
    } catch (error) {
        console.error(`Error creating admin user: ${error}`);
    } finally {
        // Disconnect from the database when finished
        mongoose.disconnect();
    }

}

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const populate = async () => {
    await createAdminUser(adminUsername, adminPassword)
    if (db) db.close();
    console.log('done');
}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });

console.log('processing ...');