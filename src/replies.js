const main = (message) => {
    const parsedMsg = message.content.toLowerCase();

    if (parsedMsg === 'who is the best kiddo?') {
        message.channel.send('Naynay!');
    }
    if (parsedMsg === 'john is gay') {
        message.channel.send('agreed');
    }
};

module.exports = main;
