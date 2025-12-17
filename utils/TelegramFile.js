import { Readable } from 'readable-stream';
import { Api } from 'telegram';
import { BigInt } from 'big-integer'; // GramJS might use a polyfill or native BigInt.
// However, in modern JS environments supported by React Native Web, native BigInt is available.
// But GramJS uses 'big-integer' package sometimes.
// We will try native BigInt first, usually GramJS accepts it or converts it.

export class TelegramFile {
    constructor(client, message) {
        this.client = client;
        this.message = message;

        // Find the document attribute to get exact size and name
        const doc = message.media?.document;
        if (!doc) throw new Error('No document found');

        this.length = doc.size.toJSNumber ? doc.size.toJSNumber() : doc.size;

        const attr = doc.attributes.find(a => a.fileName);
        this.name = attr ? attr.fileName : 'video.mp4';

        this.document = doc;
    }

    createReadStream(opts = {}) {
        const start = opts.start || 0;
        const end = opts.end || this.length - 1;
        const totalToFetch = end - start + 1;

        // Create a readable stream
        const stream = new Readable({
            read() {} // No-op, we push data manually
        });

        // Start fetching
        this._fetchData(stream, start, totalToFetch);

        return stream;
    }

    async _fetchData(stream, offset, limit) {
        try {
            // console.log(`Streaming: fetching ${limit} bytes from ${offset}`);

            // Ensure BigInt for offset (GramJS often expects BigInts for file offsets)
            // If the environment supports BigInt:
            const offsetBI = typeof BigInt !== 'undefined' ? BigInt(offset) : offset;
            // Limit is usually a number (count of bytes) but checking docs helps.
            // iterDownload signature: (file, { limit, offset, chunkSize, requestSize })

            // We pass this.document instead of this.message.media to be more explicit.
            // GramJS internal helpers usually extract input location from the document.

            const iter = this.client.iterDownload(this.document, {
                offset: offsetBI,
                limit: limit,
                chunkSize: 128 * 1024, // 128KB chunks
            });

            for await (const chunk of iter) {
                // chunk is a Buffer
                if (!stream.push(chunk)) {
                    // Backpressure handling if needed, but for now just push
                }
            }

            stream.push(null); // EOF
        } catch (e) {
            console.error('Stream error', e);
            stream.destroy(e);
        }
    }
}
