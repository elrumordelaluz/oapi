var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Package', new Schema({ 
    name: String,
    slug: String,
    library: String,
    type: String,
    premium: Boolean,
    icons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Icon'
    }]
}));
