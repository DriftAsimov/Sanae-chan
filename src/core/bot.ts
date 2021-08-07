import { Client, Collection} from 'discord.js'
import { readdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config()

export class Sanae extends Client
{
    public commands: Collection<string, any> = new Collection();
    public aliases: Collection<string, any> = new Collection();

    private registerEvent = (): void =>
    {
        readdirSync(path.resolve(__dirname, '..', 'events'))
            .forEach(file =>
                {
                    const event = new (require (`../events/${file}`).default)(this)
                    this.on(file.slice(0, -3), (...args) => event.run(...args))
                })
    }

    private registerCommand = (): void =>
    {
        readdirSync(path.resolve(__dirname, '..', 'commands'))
            .forEach(file => 
                {
                    const command = new (require(`../commands/${file}`).default)(this)
                    if (command.aliases) command.aliases.forEach((a: any) => this.aliases.set(a, file))
                    this.commands.set(file.slice(0, -3).toLowerCase(), command)
                })
    }

    public start = (): void =>
    {
        this.registerCommand()
        this.registerEvent()
        
        this.login(process.env.TOKEN)
    }
}