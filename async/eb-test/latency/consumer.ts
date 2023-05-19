import { EventBridgeEvent } from 'aws-lambda';
import { EbTestEvent } from './event';
import { MetricUnits, Metrics } from '@aws-lambda-powertools/metrics';

const metrics = new Metrics();
let coldStart = true;

export const lambdaHandler = async (event: EventBridgeEvent<'eb-test', EbTestEvent>): Promise<any> => {
    const consumerTime = new Date();
    const producerTime = new Date(event.detail.producerTime);
    const latency = consumerTime.getTime() - producerTime.getTime();
    const producerColdStart = event.detail.coldStart;
    const isColdStart = coldStart || producerColdStart;
    metrics.addDimension('ColdStart', isColdStart.toString());
    metrics.addMetric('Latency', MetricUnits.Milliseconds, latency);
    metrics.publishStoredMetrics();
    coldStart = false;
};
