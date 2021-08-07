import { Interaction, MessageActionRow, MessageEmbed, MessageButton, User } from "discord.js";
import { Sanae } from "../core/bot";

export default class Interact
{
    constructor(private client: Sanae) {}

    public run = async (interaction: Interaction) =>
    {
        if (!interaction.isButton() || interaction.channel?.type !== "GUILD_TEXT") return

        if (interaction.customId === "ticketButton")
        {
            await interaction.deferUpdate()

            const user = interaction.user
            const slicedName = user?.username?.slice(0, 5)
            const guild = interaction.channel.guild
            
            const cat: any = guild.channels.cache.find(e => e.name.toLowerCase() === "tickets" && e.type === "GUILD_CATEGORY") || await guild.channels.create("tickets", { type: "GUILD_CATEGORY" })
            const channel = await guild.channels.create(slicedName, 
            {
                type: "GUILD_TEXT",
                parent: cat,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: user?.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    }
                ]
            })

            const embed = new MessageEmbed()
                .setTitle(`${slicedName}'s Ticket`)
                .setDescription("This is the start of your ticket, please use this channel appropriately.")
                .setColor(0x81E0DA)

            await channel.send({ content: `${user}`, embeds: [embed] })

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("archiveChannel")
                    .setStyle("SECONDARY")
                    .setEmoji("🗑")
            )

            const archiveEmbed = new MessageEmbed()
                .setDescription("Click on the button whenever you want to close this ticket.")
                .setColor(0xDD67E0)

            const msg = await channel.send({ embeds: [archiveEmbed], components: [row] })
            await msg.pin()

            const filter = (e: { customId: string; user: User; }) => e.customId === "archiveChannel" && e.user === user
            const collector = msg.createMessageComponentCollector({ filter })

            collector.on('collect', async (i: any)=>
            {
                if (i.customId === 'archiveChannel' && i.channel?.type === "GUILD_TEXT")
                {
                    await i.deferUpdate()
                    
                    if (i.user === user)    // if interactor is the same person who opened the ticket
                    {
                        await i.channel.permissionOverwrites.create(i.user, { "VIEW_CHANNEL": false })
                        await msg.delete()

						const drow = new MessageActionRow()
							.addComponents(
								new MessageButton()
									.setCustomId("deleteChannel")
									.setStyle("SUCCESS")
									.setEmoji("✔")
							)

						const deleteEmbed = new MessageEmbed()
							.setDescription(`This ticket was archived. Click on the button below to delete the channel.`)
							.setColor(0xDD67E0)

						const dmsg = await channel.send({ embeds: [deleteEmbed], components: [drow] })

						const dfilter = (e: { customId: string; }) => e.customId === "deleteChannel"
						
                        const dcollector = dmsg.createMessageComponentCollector({ filter: dfilter })

						dcollector.on('collect', async i =>
						{
							if (i.customId === 'deleteChannel' && i.channel?.type === "GUILD_TEXT")
							{
								const cat = i.channel.parent
								if (cat && cat.children.size <= 1)
								{
									cat.children.forEach(e => 
                                    {
                                        e.delete()
                                    });

                                    await cat.delete()
								}
								else { await i.channel.delete() }
							}
						})
					}
                }
            })


        }
    }
}
