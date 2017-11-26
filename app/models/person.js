var mongoose = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    Schema = mongoose.Schema;

var ContactInfo = require('./contactInfo');

var personSchema = new Schema({
    _id: Schema.Types.ObjectId,
  	name: {type: String, required: true, index: true},
    dob: {type: Date},
    contactInfo: [{type: Schema.Types.ObjectId, ref: 'ContactInfo'}],
    story: {type: String},
    network: [{type: Schema.Types.ObjectId, ref: 'Person'}],
  	date: {type: Date, default: Date.now}
});
personSchema.plugin(mongooseHistory);

var Person = module.exports = mongoose.model('Person', personSchema);

module.exports.updateInfo = function(oldInfo, newInfo, callback) {
    Person.findOne({name: oldInfo.name}, function(err, person){
      if(err) throw err;
      else {
        var promises = [];

        promises.push(new Promise(function(resolve, reject) {
            var infoToUpdate = Object.assign({}, newInfo);
            delete infoToUpdate.contactInfo; //we handle contact info separately
            person.update(infoToUpdate, function(err, person) {
                if(err) return reject(err);
                else return resolve(person);
            });
        }));

          promises.push(Promise.resolve(function(resolve, reject) {
            ContactInfo.findOne({
                person: person._id,
            }, function(err, contactInfo) {
                if (err) return reject(err);
                else if (contactInfo == null) reject({msg: 'No match found.'});
                else {
                    contactInfo.update(newInfo.contactInfo, function(err, info) {
                    if (err) return reject(err);
                    return resolve(info);
                  });
                }
            });
          }));


        Promise.all(promises).then(function(result) {
            callback(null, result);
        }, function(err) {
            callback(err);
        })
      }
    });
};

module.exports.create = function(candidate, contactInfo, callback) {
    Person.findOne({name: candidate.name}, function(err, existingUser) {
        if (err)  return callback(err);
        var person = candidate;
        person._id = new mongoose.Types.ObjectId();
        contactInfo.person = person._id;

        new ContactInfo(contactInfo).save(function(err, info) {
          if (err) return callback(err);
          person.contactInfo = info._id;
          new Person(person).save(callback);
        });
    });
};

module.exports.getByName = function(name, callback) {
	  Person.findOne({name: name}).populate('ContactInfo').exec(callback);
};
