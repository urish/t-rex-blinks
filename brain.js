require('rxjs/add/operator/filter');
require('rxjs/add/operator/map');

const { MuseClient, channelNames } = require('muse-js');

async function connect() {
    const client = new MuseClient();
    await client.connect();

    const leftChannel = channelNames.indexOf('AF7');
    const leftBlinks = client.eegReadings
        .filter(r => r.electrode === leftChannel)
        .map(r => Math.max(...r.samples.map(n => Math.abs(n))))
        .filter(max => max > 400);

    client.start();

    leftBlinks.subscribe(() => {
        const jumpEvent = new Event('keydown');
        jumpEvent.keyCode = 32;
        document.dispatchEvent(jumpEvent);
    });
}

window.connect = connect;
