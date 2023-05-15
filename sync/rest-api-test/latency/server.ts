import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MetricResolution, Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
let coldStart = true;
const metrics = new Metrics();
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestTime = new Date();
    const clientTime = new Date(event.queryStringParameters?.clientTime as string);
    const requestLatency = requestTime.getTime() - clientTime.getTime();
    const clientColdStart = event.queryStringParameters?.coldStart;
    const isColdStart = clientColdStart || coldStart;
    coldStart = false;
    metrics.addDimension('ColdStart', isColdStart.toString());
    metrics.addMetric('RequestLatency', MetricUnits.Milliseconds, requestLatency, MetricResolution.High);
    metrics.publishStoredMetrics();
    const responseTime = new Date();
    return {
        statusCode: 200,
        body: JSON.stringify({
            responseTime: responseTime.toISOString(),
            requestLatency: requestLatency,
            isColdStart: isColdStart,
        }),
    };
};
