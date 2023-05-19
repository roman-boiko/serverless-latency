import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';

const streamName = process.env.STREAM_NAME ?? '';
const kinesisClient = new KinesisClient({});
let coldStart = true;
export const lambdaHandler = async (event: any): Promise<any> => {
    const producerTime = new Date();
    const data = JSON.stringify({ coldStart: coldStart, producerTime: producerTime.toISOString() });
    const params = {
        StreamName: streamName,
        PartitionKey: Math.random().toString(36).substring(2, 15),
        Data: Buffer.from(data),
    };
    try {
        await kinesisClient.send(new PutRecordCommand(params));
    } catch (err) {
        console.log('Error', err);
    }
    coldStart = false;
};
