import { MetricResolution, Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { request } from 'undici';
let coldStart = true;
const metrics = new Metrics();
const url = process.env.URL ?? '';
export const lambdaHandler = async (event: any): Promise<any> => {
    const clientTime = new Date();
    const { body } = await request(url, {
        method: 'GET',
        query: { clientTime: clientTime.toISOString(), coldStart: coldStart },
    });
    const response = await body.json();
    const responseTime = new Date();
    const serverSesponseTime = new Date(response.responseTime);
    const responseLatency = responseTime.getTime() - serverSesponseTime.getTime();
    const totalLatency = responseLatency + response.requestLatency;
    const isColdStart = response.isColdStart || coldStart;
    coldStart = false;
    metrics.addDimension('ColdStart', isColdStart.toString());
    metrics.addMetric('ResponseLatency', MetricUnits.Milliseconds, responseLatency, MetricResolution.High);
    metrics.addMetric('TotalLatency', MetricUnits.Milliseconds, totalLatency, MetricResolution.High);
    metrics.publishStoredMetrics();
    return {};
};
