import { Sanae } from "./core/bot";

const bot = new Sanae({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });

bot.start();