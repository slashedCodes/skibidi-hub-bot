const { Constants } = require("eris");
const fs = require("node:fs");
require("dotenv").config();

const options = {
    name: "unban",
    description: "Unban an IP.",
    options: [
      {
        type: 3,
        name: "ip",
        description: "IP of the user to be unbanned.",
        required: true
      }
    ]
}
  
function execute(interaction) {
    ips = JSON.parse(fs.readFileSync(process.env.IP_BANS_FILE));
    if(!ips.includes(interaction.data.options[0].value)) return console.log("the ip address provided isnt banned.");
    ips.splice(ips.indexOf(interaction.data.options[0].value), 1)

    fs.writeFileSync(process.env.IP_BANS_FILE, JSON.stringify(ips), {encoding:'utf8', flag:'w'});
    
    interaction.createMessage(`Successfully banned ${interaction.data.options[0].value}.`);
}

exports.default = {options, execute};
