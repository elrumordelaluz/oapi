var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Icon', new Schema({ 
    name: { type: String, required: true },
    iconSlug: { type: String, unique: true },
    packageSlug: String,
    package: String,
    library: String,
    type: String,
    tags: [String],
    paths: Schema.Types.Mixed,
    premium: Boolean,
    dateAdded : { type: Date, default: Date.now }
}));
