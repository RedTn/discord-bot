const main = (message) => {
    if (message.content === 'who is the best kiddo?') {
        message.channel.send('Naynay!');
    }
    if (message.content === 'john is gay') {
        message.channel.send('agreed');
    }
};

module.exports = main;