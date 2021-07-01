const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const queue = new Map();
const { MessageEmbed } = require("discord.js");

const os = require('os');

const prefix = "#"
client.on('ready',() =>{
    client.user.setStatus('online','Test')
})
client.on("message", function(message) {
    if (message.author.bot) return;
    if(!message.content.startsWith("#")) return;
    const prefix="#" ;
    const serverQueue = queue.get(message.guild.id);
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

if (message.content.startsWith(`${prefix}play`)) {
execute(message, serverQueue);
return;
} else if (message.content.startsWith(`${prefix}skip`)) {
skip(message, serverQueue);
return;
} else if (message.content.startsWith(`${prefix}stop`)) {
stop(message, serverQueue);
return;
}
else if(message.content.startsWith('#sysfetch')){
    
        let servercount = client.guilds.cache.size;
        
        let usercount = client.users.cache.size;
        
        let channelscount = client.channels.cache.size;
        
        let arch = os.arch();
        
        let platform = os.platform();
        
        let cores = os.cpus().length;
       
    
        let stats = new MessageEmbed()
        .setTitle(`${client.user.username} Info`)
        .setColor('RED')
        .addField("Server Count", `${servercount}`, true)
        .addField("Channel's Count", `${channelscount}`, true)
        .addField('Architecture', `${arch}`, true)
        .addField('Platform', `${platform}`, true)
        .addField('Cores', `${cores}`, true)
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        message.channel.send(stats);
    
    
    module.exports.help = {
        name: "stats"
   }}

async function execute(message, serverQueue) {
const args = message.content.split(" ");

const voiceChannel = message.member.voice.channel;
if (!voiceChannel)
  return message.channel.send(
    "You need to be in a voice channel to play music!"
  );
const permissions = voiceChannel.permissionsFor(message.client.user);
if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
  return message.channel.send(
    "I need the permissions to join and speak in your voice channel!"
  );
  }
  const songInfo = await ytdl.getInfo(args[1]);
const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
};
if (!serverQueue) {
const queueContruct = {
  textChannel: message.channel,
  voiceChannel: voiceChannel,
  connection: null,
  songs: [],
  volume: 100,
  playing: true
};
queue.set(message.guild.id, queueContruct);

queueContruct.songs.push(song);
try {
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
    play(message.guild, queueContruct.songs[0]);
  } catch (err) {
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
  }
} else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}
function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
      
    if (!serverQueue)
      return message.channel.send("There is no song that I could stop!");
      
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    const dispatcher = serverQueue.connection
.play(ytdl(song.url))
.on("finish", () => {
  serverQueue.songs.shift();
  play(guild, serverQueue.songs[0]);
})
.on("error", error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
    

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        let e=new MessageEmbed()
        .setTitle('Latency')
        .setColor('RED')
        .addField(timeTaken+'ms',message.author.tag)

        message.channel.send(e)
    }
    else if (command === "sum") {
        const numArgs = args.map(x => parseFloat(x));
        if (!numArgs.length){
            
            let s=new MessageEmbed()
        .setTitle('Sum')
        .setColor('RED')
        .addField("Please enter numbers to add",message.author.tag)
        message.channel.send(s)

        }
        else{
            const sum = numArgs.reduce((counter, x) => counter += x);
            let u=new MessageEmbed()
            .setTitle('Sum')
            .setColor('RED')
            .addField("Sum of numbers given is "+sum,message.author.tag)
            message.channel.send(u)
          }}
    else if(command==="help"){
        const exampleEmbed = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('J.A.R.V.I.S')
    .setURL('https://www.youtube.com/TheTechieScientist/')
    .setAuthor('The Techie Scientist', 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b0/JuARaVeInSy.png/revision/latest?cb=20120722164138', 'https://github.com/IM-TechieScientist')
    .setDescription('Help command shows all commands')
    .addFields(
        { name: 'Prefix', value: '#' },
        { name: 'Commands', value: 'help,ping,say,sum,avatar,play(url),skip,stop,sysfetch', inline: true },
    )
    .setTimestamp()
    .setFooter("Requested by "+message.author.username,message.author.displayAvatarURL())
message.channel.send(exampleEmbed);

        
   } 
   
   else if(command==="avatar"){
    
    if(message.mentions.users.size){
        let member=message.mentions.users.first()
    if(member){
        const emb=new Discord.MessageEmbed().setImage(member.displayAvatarURL()).setTitle(member.username)
        message.channel.send(emb)
        
    }
    else{
        message.channel.send("Sorry none found with that name")

    }
    }else{
        const emb=new Discord.MessageEmbed().setImage(message.author.displayAvatarURL()).setTitle(message.author.username)
        message.channel.send(emb)
    }
   }
   else if(command==="say")
{
    let say=new MessageEmbed()
    .setTitle('Say')
    .setColor('RED')
    .addField(message.author.username+" says '"+message.content.slice(4,)+" ' ","J.A.R.V.I.S")
    message.channel.send(say)

} 
   
    
    
   }

    
  
 );

client.login(config.BOT_TOKEN);
