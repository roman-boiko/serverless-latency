import { Metrics } from '@aws-lambda-powertools/metrics';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const SNS_TOPIC = process.env.SNS_TOPIC ?? '';
const snsClient = new SNSClient({});
let coldStart = true;
export const lambdaHandler = async (event: any): Promise<any> => {
    const producerTime = new Date();
    const params = {
        Message: JSON.stringify({ coldStart: coldStart, producerTime: producerTime.toISOString() }),
        TopicArn: SNS_TOPIC,
    };
    try {
        await snsClient.send(new PublishCommand(params));
    } catch (err) {
        console.log('Error', err);
    }
    coldStart = false;
};
