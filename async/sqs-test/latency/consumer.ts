import { SQSEvent } from 'aws-lambda';
import { MetricUnits, Metrics } from '@aws-lambda-powertools/metrics';

const metrics = new Metrics();
let coldStart = true;

export const lambdaHandler = async (event: SQSEvent): Promise<any> => {
    const consumerTime = new Date();
    const message = JSON.parse(event.Records[0].body);
    const producerTime = new Date(message.producerTime);
    const latency = consumerTime.getTime() - producerTime.getTime();
    const producerColdStart = message.coldStart;
    const isColdStart = coldStart || producerColdStart;
    metrics.addDimension('ColdStart', isColdStart.toString());
    metrics.addMetric('Latency', MetricUnits.Milliseconds, latency);
    metrics.publishStoredMetrics();
    coldStart = false;
};
