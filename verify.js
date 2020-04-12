'use_strict'

const Discord = require('discord.js')
const config = require('./config.json')

require("./web/WebServer");

const completemsg = `Thank you for agreeing to the rules and code of conduct! You are now a verified member of the guild! \n\n**Your unique token is your signature that you have read and understood our rules.**\n`

const shortcode = (n) => {
    const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789'
    let text = ''
    for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text;
}

const client = new Discord.Client()

client.on('ready', () => {
    client.user.setActivity(config.playing)
    console.log(`[VERIFYBOT] Connected as ${client.user.username}#${client.user.discriminator} ${client.user.id}`)
})

client.on('guildMemberAdd', (member) => {
    if (member.user.bot || member.guild.id !== process.env.GUILD) return
    const token = shortcode(8)
    const welcomemsg = `Welcome to the guild! Make sure you check out the \`#our-server-rules\` channel. \n\n If you accept the code of conduct, please verify your agreement by replying to **this DM** with the verification phrase: \n\n\`I agree to abide by all rules. My token is ${token}.\`\n\n **This message is case-sensitive, and please include the period at the end! ** \n\nQuestions? Get at a staff member in the server or via DM, You will not have full access to the server untill this is complete`
    console.log(`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`)
    member.send(welcomemsg)
    member.user.token = token
})

const verifymsg = 'I agree to abide by all rules. My token is {token}.'

client.on('message', (message) => {
    if (message.author.bot || !message.author.token || message.channel.type !== `dm`) return
    if (message.content !== (verifymsg.replace('{token}', message.author.token))) return
    message.channel.send({
        embed: {
            color: Math.floor(Math.random() * (0xFFFFFF + 1)),
            description: completemsg,
            timestamp: new Date(),
            footer: {
                text: `Verification Success`
            }
        }
    })
  
  /*let verifiedUser = new Discord.RichEmbed()
        verifiedUser.setTitle("Verification Complete")
        verifiedUser.setColor(Math.floor(Math.random() * (0xFFFFFF + 1)))
        verifiedUser.setDescription(`${message.author.tag} Has completed Verification`)
        verifiedUser.addField("USER TOKEN", `${message.author.token}`)
        verifiedUser.addField("ROLE ASSIGNED", "``Verified Member``")
        verifiedUser.addField("USER ID", `${message.author.id}`)*/
                              
  
 const logChan = client.guilds.get(process.env.GUILD).channels.find(c => c.name === 'verify-logs')
   if (!logChan) return message.channel.send("Please create a ``verify-logs`` Channel")
    //client.guilds.get(process.env.GUILD).member(message.author).roles.add(process.env.ROLE) // ensure this is a string in the config ("")
      client.guilds.get(process.env.GUILD).member(message.author).roles.add(process.env.ROLE)
       .then(console.log(`TOKEN: ${message.author.token} :: Role ${process.env.ROLE} added to member ${message.author.id}`))
        //logChan.send(`USER: ${message.author.username} Has Completed verification \n\n TOKEN: ${message.author.token} \n\n` + "ROLE: ``Verified Member`` Added")
        logChan.send({
          embed: {
            title: 'Verification Complete',
            description: "``" + `${message.author.username}` + "``" + " Has completed Verification \n\n" + ' VERIFY TOKEN:' + ` ${message.author.token}` + ' \n\nROLE NAME: ``Verified Member`` Added' + ' \n\nUSER ID:' + ` ${message.author.id}`,
            timestamp: new Date(),
            footer: {
              text: 'Verification Success'
          }
        }
     }).catch(console.error)

client.on('disconnect', (event) => {
    setTimeout(() => client.destroy().then(() => client.login(config.token)), 10000)
    console.log(`[DISCONNECT] Notice: Disconnected from gateway with code ${event.code} - Attempting reconnect.`)
})

client.on('reconnecting', () => {
    console.log(`[NOTICE] ReconnectAction: Reconnecting to Discord...`)
})

client.on('error', console.error)
client.on('warn', console.warn)

process.on('unhandledRejection', (error) => {
    console.error(`Uncaught Promise Error: \n${error.stack}`)
})

process.on('uncaughtException', (err) => {
    let errmsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}/`, 'g'), './')
    console.error(errmsg)
})
  
});

client.login(process.env.TOKEN)
