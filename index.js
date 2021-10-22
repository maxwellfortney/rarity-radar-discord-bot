import { Client, Intents, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = "!"


client.once("ready", () => {
    console.log("Bot logged in and ready")
})


client.on("messageCreate", async (message) => {
    let idArg = "";
    let collectionArg = "";


    if (!message.content.startsWith(prefix) || message.author.bot || message.channelId !== "900824546125430844") {
        return;
    } else {
        const args = message.content.slice(prefix.length).split(" ");
        const command = args.shift().toLowerCase()

        if (args.indexOf("id") === -1) {
            return;
        }


        if (command === "rarity") {
            idArg = args.pop();
            args.pop()

            while (args.length > 0) {
                collectionArg += args.shift() + " "
            }

            console.log(idArg)
            console.log(collectionArg)

            if (idArg && collectionArg) {
                const res = await fetch(`https://rarity-radar.vercel.app/api/collections/${collectionArg.trim()}/tokens/${idArg.trim()}`)

                if (res.status === 200) {
                    const resData = await res.json()

                    const exampleEmbed = {
                        color: 0x0099ff,
                        title: resData.name || collectionArg.trim() + " " + resData.rank.toString(),
                        fields: [
                            {
                                name: 'Rank',
                                value: resData.rank.toString(),
                                inline: true,
                            },
                            {
                                name: 'Rarity Score',
                                value: resData.rarityScore.toFixed(2).toString(),
                                inline: true,
                            },
                            {
                                name: 'Mean Percentage',
                                value: resData.meanPercentage.toFixed(2).toString() + "%",
                                inline: true,
                            },
                        ],
                        image: {
                            url: resData.image,
                        },
                        timestamp: new Date(),
                    };

                    message.channel.send({ embeds: [exampleEmbed] });
                } else {
                    message.channel.send("No collection or tokenId matching " + collectionArg.trim() + " " + idArg.trim())
                }
            } else {
                return
            }
        }
    }
})

client.login("OTAwODg0MzA1MjI2NjM3MzYz.YXHz4w.0nEGcjxbiG0x6SkhzzFqAbfEQZM")