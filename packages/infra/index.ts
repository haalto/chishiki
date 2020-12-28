import * as awsx from "@pulumi/awsx";
import { config } from "dotenv";
config();

const apiListener = new awsx.elasticloadbalancingv2.NetworkListener(
  "api-listener",
  { port: 4000 }
);
const apiService = new awsx.ecs.FargateService("api-service", {
  waitForSteadyState: false,
  taskDefinitionArgs: {
    containers: {
      serversideService: {
        image: awsx.ecs.Image.fromPath("api-service", "../api"),
        memory: 512,
        portMappings: [apiListener],
        environment: [
          { name: "PGUSER", value: process.env.PGUSER },
          { name: "PGHOST", value: process.env.PGHOST },
          { name: "PGPASSWORD", value: process.env.PGPASSWORD },
          { name: "PGDATABASE", value: process.env.PGDATABASE },
          { name: "PGPORT", value: process.env.PGPORT },
        ],
      },
    },
  },
  desiredCount: 1,
});

const serverListener = new awsx.elasticloadbalancingv2.NetworkListener(
  "server-listener",
  { port: 5001 }
);
const serverService = new awsx.ecs.FargateService("server-service", {
  waitForSteadyState: false,
  taskDefinitionArgs: {
    containers: {
      serversideService: {
        image: awsx.ecs.Image.fromPath("server-service", "../server"),
        memory: 512,
        portMappings: [serverListener],
        environment: [
          { name: "API_URI", value: apiListener.endpoint.hostname },
        ],
      },
    },
  },
  desiredCount: 1,
});

const clientListener = new awsx.elasticloadbalancingv2.NetworkListener(
  "client-listener",
  { port: 80 }
);
const clientService = new awsx.ecs.FargateService("client-service", {
  waitForSteadyState: false,
  taskDefinitionArgs: {
    containers: {
      clientsideService: {
        image: awsx.ecs.Image.fromPath("client-service", "../client"),
        memory: 512,
        portMappings: [clientListener],
        environment: [
          {
            name: "SERVER_URI",
            value: serverListener.endpoint.hostname,
          },
        ],
      },
    },
  },
  desiredCount: 1,
});

export let CLIENT = clientListener.endpoint.hostname;
export let API = apiListener.endpoint.hostname;
export let SERVER = serverListener.endpoint.hostname;
