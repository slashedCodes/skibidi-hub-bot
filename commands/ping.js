const { Constants } = require("eris");

const options = {
    name: 'ping',
    description: 'Ping!',
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
}

function execute(interaction) {
    interaction.createMessage("Pong!");
}

exports.default = {options, execute};
