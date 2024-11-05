const commandName = 'bigtext';
const version = '1.0.0';
const permission = 0;
const description = 'Make your text bigger!';
const author = 'John Marky Dev';
const payload = 'BIGTEXT_COMMAND';
const usage = 'Text';

const execute = async ({ userMessage, messenger }) => {
  try {
    if (!userMessage) return await messenger.send(global.language('commands', 'noText'));
    var result = userMessage.toLowerCase().replace(/\./g, `░░░\n░░░\n░░░\n░░░\n██╗\n╚═╝\n`)
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|a/g, `░█████╗░\n██╔══██╗\n███████║\n██╔══██║\n██║░░██║\n╚═╝░░╚═╝ `)
      .replace(/b/g, `██████╗░\n██╔══██╗\n██████╦╝\n██╔══██╗\n██████╦╝\n╚═════╝░\n`)
      .replace(/c/g, `░█████╗░\n██╔══██╗\n██║░░╚═╝\n██║░░██╗\n╚█████╔╝\n░╚════╝░\n`)
      .replace(/d|đ/g, `██████╗░\n██╔══██╗\n██║░░██║\n██║░░██║\n██████╔╝\n╚═════╝░\n`)
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|e/g, `███████╗\n██╔════╝\n█████╗░░\n██╔══╝░░\n███████╗\n╚══════╝\n`)
      .replace(/f/g, `███████╗\n██╔════╝\n█████╗░░\n██╔══╝░░\n██║░░░░░\n╚═╝░░░░░\n`)
      .replace(/g/g, `░██████╗░\n██╔════╝░\n██║░░██╗░\n██║░░╚██╗\n╚██████╔╝\n░╚═════╝░\n`)
      .replace(/h/g, `██╗░░██╗\n██║░░██║\n███████║\n██╔══██║\n██║░░██║\n╚═╝░░╚═╝\n`)
      .replace(/i/g, `██╗\n██║\n██║\n██║\n██║\n╚═╝\n`)
      .replace(/ì|í|ị|ỉ|ĩ|i/g, `░░░░░██╗\n░░░░░██║\n░░░░░██║\n██╗░░██║\n╚█████╔╝\n░╚════╝░\n`)
      .replace(/k/g, `██╗░░██╗\n██║░██╔╝\n█████═╝░\n██╔═██╗░\n██║░╚██╗\n╚═╝░░╚═╝\n`);
    result = result.replace(/l/g, `██╗░░░░░\n██║░░░░░\n██║░░░░░\n██║░░░░░\n███████╗\n╚══════╝\n`)
      .replace(/l/g, `██╗░░░░░\n██║░░░░░\n██║░░░░░\n██║░░░░░\n███████╗\n╚══════╝`)
      .replace(/m/g, `███╗░░░███╗\n████╗░████║\n██╔████╔██║\n██║╚██╔╝██║\n██║░╚═╝░██║\n╚═╝░░░░░╚═╝\n`)
      .replace(/n/g, `███╗░░██╗\n████╗░██║\n██╔██╗██║\n██║╚████║\n██║░╚███║\n╚═╝░░╚══╝\n`)
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|o/g, `░█████╗░\n██╔══██╗\n██║░░██║\n██║░░██║\n╚█████╔╝\n░╚════╝░\n`)
      .replace(/p/g, `██████╗░\n██╔══██╗\n██████╔╝\n██╔═══╝░\n██║░░░░░\n╚═╝░░░░░\n`)
      .replace(/q/g, `░██████╗░\n██╔═══██╗\n██║██╗██║\n╚██████╔╝\n░╚═██╔═╝░\n░░░╚═╝░░░\n`)
      .replace(/r/g, `██████╗░\n██╔══██╗\n██████╔╝\n██╔══██╗\n██║░░██║\n╚═╝░░╚═╝\n`)
      .replace(/s/g, `░██████╗\n██╔════╝\n╚█████╗░\n░╚═══██╗\n██████╔╝\n╚═════╝░\n`)
      .replace(/t/g, `████████╗\n╚══██╔══╝\n░░░██║░░░\n░░░██║░░░\n░░░██║░░░\n░░░╚═╝░░░\n`)
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|u/g, `██╗░░░██╗\n██║░░░██║\n██║░░░██║\n██║░░░██║\n╚██████╔╝\n░╚═════╝░\n`)
    result = result.replace(/l/g, `██╗░░░░░\n██║░░░░░\n██║░░░░░\n██║░░░░░\n███████╗\n╚══════╝\n`)
      .replace(/v/g, `██╗░░░██╗\n██║░░░██║\n╚██╗░██╔╝\n░╚████╔╝░\n░░╚██╔╝░░\n░░░╚═╝░░░\n`)
      .replace(/x/g, `██╗░░██╗\n╚██╗██╔╝\n░╚███╔╝░\n░██╔██╗░\n██╔╝╚██╗\n╚═╝░░╚═╝\n`)
      .replace(/ỳ|ý|ỵ|ỷ|ỹ|y/g, `\n██╗░░░██╗\n╚██╗░██╔╝\n░╚████╔╝░\n░░╚██╔╝░░\n░░░██║░░░\n░░░╚═╝░░░\n`)
      .replace(/w/g, `\n░██╗░░░░░░░██╗\n░██║░░██╗░░██║\n░╚██╗████╗██╔╝\n░░████╔═████║░\n░░╚██╔╝░╚██╔╝░\n░░░╚═╝░░░╚═╝░░\n`)
      .replace(/z/g, `███████╗\n╚════██║\n░░███╔═╝\n██╔══╝░░\n███████╗\n╚══════╝\n`)
      .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");

    return await messenger.send(result);
  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send({ text: 'An error occurred while processing your request.' });
  }
};

module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute,
  payload,
  usage
};