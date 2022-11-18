const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamsSchema = Schema({
    name: String,
    image: String
})

module.exports = mongoose.model('teams', TeamsSchema);