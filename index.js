const Eris = require("eris");
const Constants = Eris.Constants;
const fs = require("node:fs");
require("dotenv").config();

const admins = JSON.parse(fs.readFileSync("./admins.json"));
const client = new Eris(process.env.BOT_TOKEN, { 
	intents: [
		Constants.Intents.guilds,
        Constants.Intents.guildMessages,
        Constants.Intents.guildMessageReactions,
        Constants.Intents.directMessages,
        Constants.Intents.directMessageReactions,
	]
});

client.on("ready", async () => {
	console.log("Ready!");
	console.log("Deploying commands...");

	client.commands = new Eris.Collection();
	const commands = fs.readdirSync("./commands");

	client.bulkEditCommands([]);

	commands.forEach(file => {
		const command = require(`./commands/${file}`).default;
		if('options' in command && 'execute' in command) {
			console.log(`Deploying command /${command.options.name}`)
			client.commands.set(command.options.name, command);
			client.createGuildCommand(process.env.GUILD_ID, command.options);
			console.log(`Deployed command /${command.options.name}`)
		} else {
			console.error(`Invalid command setup for command ${file}`);
			return;
		}
	})
});

client.on("interactionCreate", async (interaction) => {
	if(interaction instanceof Eris.CommandInteraction) {
		if(!client.commands.has(interaction.data.name)) return interaction.createMessage("Command does not exist.");

		try {
			if(!admins.includes(interaction.member.id)) return interaction.createMessage("You do not have the permissions to run this command.");
			await client.commands.get(interaction.data.name).execute(interaction);
		} catch (error) {
			console.error(error);
		}
	}
})

client.connect();

process.on("uncaughtException", (error) => {
	console.error(error);
})