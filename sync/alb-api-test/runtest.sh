#!/bin/bash

for ((i=1; i<=1024; i++)); do
    aws lambda invoke --function-name arn:aws:lambda:eu-west-1:894475706343:function:alb-api-test-ClientFunction-PHBXDffHs9gb ouput.json --region eu-west-1
    echo "Test $i"
done