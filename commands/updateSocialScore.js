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
    name: 'updatesocialscore',
    description: 'Updates a user\'s social score on SkibidiHub.',
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
            type: 3,
            name: "user",
            description: "The user to update.",
            required: true
        },
        {
            type: 4,
            name: "value",
            description: "The value to update the social score with.",
            required: true
        }
    ]
}


async function execute(interaction) {
    if(!utils.userExists(interaction.data.options[0].value)) return interaction.createMessage("User doesn't exist.");
    
    const socialScoreData = await client
        .from("users")
        .select("social_score")
        .eq("name", interaction.data.options[0].value);

    const socialScore = parseInt(socialScoreData["data"][0]["social_score"]) + parseInt(interaction.data.options[1].value);

    await client.from("users").update({"social_score": socialScore}).eq("name", interaction.data.options[0].value).then(data => {
        if(data.error) {
            return interaction.createMessage(error.toString());
        } else if(data.status != 204) {
            return interaction.createMessage(error.toString());
        }

        return interaction.createMessage("Updated.")
    });

}

exports.default = {options, execute};
