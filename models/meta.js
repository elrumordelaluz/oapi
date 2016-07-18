var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Meta', new Schema({
    prop: { type: String, required: true, unique: true },
    val: Schema.Types.Mixed,
    dateUpdated : { type: Date, default: Date.now }
}));
