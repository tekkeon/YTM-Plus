#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
dotenv.config();
import * as cdk from "aws-cdk-lib";
import { YTMDistributionStack } from "../lib/distribution-stack";
import { YTMSignalingStack } from "../lib/signaling-stack";

const app = new cdk.App();

console.log(process.env.CDK_DEFAULT_ACCOUNT);
console.log(process.env.AWS_ACCOUNT_ID);

new YTMDistributionStack(app, "YTMDistributionStack", {
  env: { account: process.env.AWS_ACCOUNT_ID, region: process.env.AWS_REGION },
});

new YTMSignalingStack(app, "YTMSignalingStack", {
  env: { account: process.env.AWS_ACCOUNT_ID, region: process.env.AWS_REGION },
});
