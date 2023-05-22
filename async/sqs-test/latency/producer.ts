import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const queueUrl = process.env.QUEUE_URL ?? '';
const sqsClient = new SQSClient({});
let coldStart = true;
export const lambdaHandler = async (event: any): Promise<any> => {
    const producerTime = new Date();
    const params = {
        MessageBody: JSON.stringify({ coldStart: coldStart, producerTime: producerTime.toISOString() }),
        QueueUrl: queueUrl,
    };
    try {
        await sqsClient.send(new SendMessageCommand(params));
    } catch (err) {
        console.log('Error', err);
    }
    coldStart = false;
};
