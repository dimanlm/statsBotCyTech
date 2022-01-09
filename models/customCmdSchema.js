const mongoose = require('mongoose');

const customCmdSchema = new mongoose.Schema({
    guildId: { type: String, require: true },
    cmdName: { type: String, require: true },
    response: { type: String, require: true }
});

const model = mongoose.model('CustomCommandModel', customCmdSchema);

module.exports = model;