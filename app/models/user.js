var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');
    SALT_WORK_FACTOR = 10;
    
var userSchema = new Schema({
	username: {type: String, required: true, index: true},
	password: {type:String, required: true},
	name: String,
    email: String,
    admin: {type: Boolean, default: false},
	date: {type: Date, default: Date.now},
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
	User.findOne(query, callback);
};

/**
 * countUsers()
 *@param: function callback
 */
module.exports.countUsers = function(callback) {
    User.count({}, function(err, count) {
       callback(err, count); 
    });
};

/**
 * createUser
 *
 *@param: User candidate
 *@param: function callback,
 *@return: null, execs callback(err, success)
 */
module.exports.createUser = function(candidate, callback) {
    //make sure the user doesn't already exist
    User.findOne({username: candidate.username}, function(err, existingUser) {
        if (err)            throw err;
        if (existingUser)   return callback(null, false,  'Username "' + candidate.username + '" is already taken.');

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            bcrypt.hash(candidate.password, salt, function(err, hash) {
                if (err)    return callback(err);
                candidate.password = hash;
                candidate.save(callback);
            });
        });
    });
}

/** hashPassword()
 * Use bcrypt to hash create a password hash
 * @param: string password
 * @param: function callback
 * @return: executes callback
 */
module.exports.hashPassword = function(password, callback) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            callback(err, hash);
        });
    })
}

/** updateUserPassword()
 * Update a users password, if previous pass is correct
 * @param: string oldPassword
 * @param: function newPassowrd
 * @return:
 */
module.exports.updateUserPassword = function(userId, newPass, callback) {
    User.findOne({ _id : userId }, function(err, user) {
        if (err) callback(err, false);
        if (user) {
            User.hashPassword(newPass, function(err, hash) {
                if (err) callback(err, false);
                user.password = hash;
                user.save(callback);
            });
        }
    });
};

/** checkUserPassword()
 * Update a users password, if previous pass is correct
 * @param: string oldPassword
 * @param: function newPassowrd
 * @return:
 */
module.exports.checkUserPassword = function(userId, candidatePassword, callback) {
    User.findOne({ _id : userId }, function(err, user) {
        if (err) callback(err, false);
        if (user) {
            User.comparePassword(candidatePassword, user.password, function(err, isMatch) {
                callback(err, isMatch);
            });
        }
    });
};

/** comparePassword()
 * Use bcrypt to compare password strings
 * @param: string candidatePassword (attempted password)
 * @param: string userPassword (actual password)
 * @param: function callback
 * @return: result of callback;
*/
module.exports.comparePassword = function(candidatePassword, userPassword, callback) {
    bcrypt.compare(candidatePassword, userPassword, function(err, isMatch) {
        if (err)    return callback(err);
                    return callback(null, isMatch);
    });
}
