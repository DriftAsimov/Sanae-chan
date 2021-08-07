import { Sanae } from "../core/bot";
import { Message } from "discord.js";

const prefix = require('../../config.json').prefix;

export default class MessageCreate
{
    constructor(private client: Sanae) {}

    public run = async (message: Message) =>
    {
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const name: any = args.shift()?.toLowerCase();

        const command: any = this.client.commands.get(name) || this.client.commands.get(this.client?.aliases.get(name))
        if (!command) return

        command.run(message, args)
    }
}