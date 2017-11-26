var mongoose = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    Schema = mongoose.Schema;

var contactInfoSchema = new Schema({
    person: {type: Schema.Types.ObjectId, ref: 'Person'},
    address: {type: String},
    phone: {type: String},
    email: {type: String},
    socialMedia: {type: String},
  	date: {type: Date, default: Date.now}
});
contactInfoSchema.plugin(mongooseHistory);

var ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

module.exports = ContactInfo;
