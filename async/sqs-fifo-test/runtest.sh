#!/bin/bash

for ((i=1; i<=1024; i++)); do
    aws lambda invoke --function-name arn:aws:lambda:eu-west-1:894475706343:function:sqs-fifo-test-ProducerFunction-d3UodO1ckKWg ouput.json --region eu-west-1
    echo "Test $i"
done