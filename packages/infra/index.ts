import * as awsx from "@pulumi/awsx";
import { config } from "dotenv";
config();

const apiListener = new awsx.elasticloadbalancingv2.NetworkListener(
  "api-listener",
  { port: 4000 }
);
const apiService = new awsx.ecs.FargateService("api-service", {
  taskDefinitionArgs: {
    containers: {
      serversideService: {
        image: awsx.ecs.Image.fromPath("api-service", "../api"),
        memory: 512,
        portMappings: [apiListener],
        environment: [
          { name: "PGUSER", value: process.env.PGUSER },
          { name: "PGHOST", value: process.env.PGHOST },
          { name: "PGPASSWORD", value: process.env.PGUSER },
          { name: "PGDATABASE", value: process.env.PGUSER },
          { name: "PGPORT", value: process.env.PGUSER },
        ],
      },
    },
  },
});

const serverListener = new awsx.elasticloadbalancingv2.NetworkListener(
  "server-listener",
  { port: 5001 }
);
const serverService = new awsx.ecs.FargateService("server-service", {
  taskDefinitionArgs: {
    containers: {
      serversideService: {
        image: awsx.ecs.Image.fromPath("server-service", "../server"),
        memory: 512,
        portMappings: [serverListener],
        environment: [
          { name: "API_HOSTNAME", value: apiListener.endpoint.hostname },
        ],
      },
    },
  },
});

const clientListener = new awsx.elasticloadbalancingv2.NetworkListener(
  "client-listener",
  { port: 80 }
);
const clientService = new awsx.ecs.FargateService("client-service", {
  taskDefinitionArgs: {
    containers: {
      clientsideService: {
        image: awsx.ecs.Image.fromPath("client-service", "../client"),
        memory: 512,
        portMappings: [clientListener],
        environment: [
          { name: "SERVER_HOSTNAME", value: serverListener.endpoint.hostname },
        ],
      },
    },
  },
});

export let URL = clientListener.endpoint.hostname;
