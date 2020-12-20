const main = (message) => {
    if (message.content === 'who is the best kiddo?') {
        message.channel.send('Naynay!');
    }
};

module.exports = main;