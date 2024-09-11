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
    name: 'delete',
    description: 'Deletes a video on SkibidiHub.',
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
          type: 3,
          name: "id",
          description: "id of the video to delete.",
          required: true
        }
    ]
}

async function deleteVideo(id) {
    return new Promise(async (resolve, reject) => {
        if(!utils.videoExists(id)) return resolve("the video you are trying to delete doesnt exist!");
        console.log(`Deleting video with the id ${id}...`);
    
        const videoFolder = path.join(process.env.VIDEOS_FOLDER, id)
    

        // Delete video on hard drive
        if(fs.existsSync(path.join(videoFolder, "video.mp4"))) fs.unlinkSync(path.join(videoFolder, "video.mp4"));
        if(fs.existsSync(path.join(videoFolder, "thumbnail.jpg"))) fs.unlinkSync(path.join(videoFolder, "thumbnail.jpg"));
        fs.rmSync(videoFolder, { recursive: true, force: true });
    
        // Delete video in the database
        await client.from("videos").delete().eq("id", id);
        return resolve(true);
    })
}


function execute(interaction) {
    deleteVideo(interaction.data.options[0].value).then(result => {
        if(isNaN(result)) {
            interaction.createMessage(result);
        } else {
            interaction.createMessage("Successfully deleted video.");
        }
    })
}

exports.default = {options, execute};
