import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const ebClient = new EventBridgeClient({});
let coldStart = true;
export const lambdaHandler = async (event: any): Promise<any> => {
    const producerTime = new Date();
    const params = {
        Entries: [
            {
                Detail: JSON.stringify({ coldStart: coldStart, producerTime: producerTime.toISOString() }),
                DetailType: 'eb-test',
                EventBusName: 'default',
                Source: 'eb-test',
            },
        ],
    };
    try {
        await ebClient.send(new PutEventsCommand(params));
    } catch (err) {
        console.log('Error', err);
    }
    coldStart = false;
};
