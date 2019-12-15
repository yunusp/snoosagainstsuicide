require('dotenv').config();
const fs = require('fs');

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

// Get bot triggers and reply
const triggers = JSON.parse(fs.readFileSync("triggers.json"));
const replyMessage = fs.readFileSync("reply.md");

// Build Snoowrap and Snoostorm clients
const r = new Snoowrap({
    userAgent: 'nodejs:com.maxniederman.snoosagainstsuicide:v0.1.0 (by /u/srcircle)',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});
const client = new Snoostorm(r);

// Configure options for stream: subreddit & results per query
const streamOpts = {
    subreddit: 'all',
    results: 200,
    pollTime: 2000
};

// Create a Snoostorm CommentStream with the specified options
const comments = client.CommentStream(streamOpts); // eslint-disable-line

// Reply to comment
comments.on('comment', (comment) => {
    const body = comment.body.replace("'", "").toLowerCase();
    if (triggers.some(trigger => body.includes(trigger)) && body.length < 700) {
        comment.reply(replyMessage);
        console.log('Replied to u/' + comment.author.name);
    }
});
