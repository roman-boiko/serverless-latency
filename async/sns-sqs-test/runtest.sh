#!/bin/bash

for ((i=1; i<=1024; i++)); do
    aws lambda invoke --function-name arn:aws:lambda:eu-west-1:894475706343:function:sns-sqs-test-ProducerFunction-RdVAjsGigCZ8 ouput.json --region eu-west-1
    echo "Test $i"
done