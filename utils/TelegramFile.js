import { Readable } from 'readable-stream';

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
            // gramjs iterDownload
            // Note: offset must be bigInt or number. gramjs handles it.
            // chunkSize is optional, default is usually 128kb or dynamic.

            // Note on gramjs: iterDownload returns AsyncIterator of Buffers.
            // We need to verify if `offset` and `limit` work as expected for ranges.
            // Actually iterDownload takes { offset, limit, chunkSize, requestSize }.
            // limit is the Total bytes to download.

            // console.log(`Streaming: fetching ${limit} bytes from ${offset}`);

            const iter = this.client.iterDownload(this.message.media, {
                offset: offset,
                limit: limit,
                chunkSize: 128 * 1024, // 128KB chunks
            });

            for await (const chunk of iter) {
                // chunk is a Buffer
                if (!stream.push(chunk)) {
                    // Backpressure handling if needed, but for now just push
                    // Readable stream buffer handling does some of this
                }
            }

            stream.push(null); // EOF
        } catch (e) {
            console.error('Stream error', e);
            stream.destroy(e);
        }
    }
}
