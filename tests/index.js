const crypto = require('crypto')
const TraceParent = require('traceparent');

// Generate traceparent
const generateTraceparent = () => {
    const version = Buffer.alloc(1).toString('hex');
    const traceId = crypto.randomBytes(16).toString('hex');
    const spanId = crypto.randomBytes(8).toString('hex');
    const flags = '01';

    const header = `${version}-${traceId}-${spanId}-${flags}`;

    return header;
}

const main = () => {
    // print original traceparent header
    const traceparentHeader = generateTraceparent();
    console.log(traceparentHeader);

    // create new traceparent with same traceid
    const traceparentBuffer = TraceParent.fromString(traceparentHeader);
    const newSpanId = crypto.randomBytes(8).toString('hex');
    const newTraceparentHeader = "00-" + traceparentBuffer.traceId + "-" + newSpanId + "-01";
    console.log(newTraceparentHeader);
}

main()