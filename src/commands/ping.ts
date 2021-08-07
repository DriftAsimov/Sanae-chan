import { Message, MessageEmbed } from "discord.js"

export default class Ping
{
    public aliases = ["latency"]
    public description = "Check the ping latency of the bot."

    public run = async (message: Message, args: string[]) =>
    {
        const ping = Date.now() - message.createdTimestamp

        const embed = new MessageEmbed()
            .setDescription(`🏓 | I have a client latency of ${ping}ms`)
            .setColor(0x5DD968)

        await message.channel.send({ embeds: [embed] })
    }
}