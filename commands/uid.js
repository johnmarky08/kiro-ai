const commandName = 'uid';
const version = '1.0.0';
const permission = 0;
const description = 'Find your UID';
const author = 'John Marky Dev';
const payload = 'UID_COMMAND';

const execute = async ({ userMessage, messenger }) => {
  try {
    if (userMessage == 'bot') {
      return await messenger.send((await messenger.botProfile()).id);
    }

    return await messenger.send(messenger.senderId);
  } catch (error) {
    console.error(`Error in executing '${commandName}' command:`, error);
    await messenger.send('An error occurred while processing your request.');
  }
};

module.exports = {
  commandName,
  version,
  permission,
  description,
  author,
  execute,
  payload
};
