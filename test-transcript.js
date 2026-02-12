const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
    try {
        console.log('Fetching for yubzJw0uiE4...');
        await YoutubeTranscript.fetchTranscript('yubzJw0uiE4');
        console.log('Success!');
    } catch (e) {
        console.log('Error:', e.message);
    }
}

test();
