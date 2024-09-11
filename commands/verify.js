const { Constants } = require("eris");
const supabase = require("@supabase/supabase-js");
const fs = require("node:fs");
const path = require("node:path");
const utils = require("./../utils.js");
const client = supabase.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);
require("dotenv").config();

const options = {
    name: 'verify',
    description: 'Verify a user on skibidihub.',
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
          type: 3,
          name: "user",
          description: "user to verify",
          required: true
        }
    ]
}

async function execute(interaction) {
    if(!utils.userExists(interaction.data.options[0].value)) return console.log("User doesn't exist!");

    await client.from("users").update({"verified": "TRUE"}).eq("name", interaction.data.options[0].value).then(data => {
        if(data.error) {
            return interaction.createMessage(error.toString());
        } else if(data.status != 204) {
            return interaction.createMessage(error.toString());
        }

        return interaction.createMessage("Verified.");
    });
}

exports.default = {options, execute};
