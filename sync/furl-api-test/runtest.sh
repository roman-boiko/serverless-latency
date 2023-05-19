#!/bin/bash

for ((i=1; i<=1024; i++)); do
    aws lambda invoke --function-name arn:aws:lambda:eu-west-1:894475706343:function:sam-furl-test-ClientFunction-HbKFub369V1y ouput.json --region eu-west-1
    echo "Test $i"
done