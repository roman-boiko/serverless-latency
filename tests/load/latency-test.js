import http from 'k6/http';
import { sleep } from 'k6';
import { AWSConfig, SignatureV4 } from 'https://jslib.k6.io/aws/0.7.2/aws.js';

const awsConfig = new AWSConfig({
    region: __ENV.AWS_REGION,
    accessKeyId: __ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: __ENV.AWS_SECRET_ACCESS_KEY,
    sessionToken: __ENV.AWS_SESSION_TOKEN,
});
const functionName = __ENV.FUNCTION_NAME;
export default function () {
    const signer = new SignatureV4({
        service: 'lambda',
        region: awsConfig.region,
        credentials: {
            accessKeyId: awsConfig.accessKeyId,
            secretAccessKey: awsConfig.secretAccessKey,
            sessionToken: awsConfig.sessionToken,
        },
    });

    const signedRequest = signer.sign(
        {
            method: 'POST',
            protocol: 'https',
            hostname: `lambda.${awsConfig.region}.amazonaws.com`,
            path: `/2015-03-31/functions/${functionName}/invocations`,
            headers: {},
            uriEscapePath: true,
            applyChecksum: false,
        },
        {
            signingDate: new Date(),
        },
    );
    http.post(signedRequest.url, {}, { headers: signedRequest.headers });
    sleep(1);
}
