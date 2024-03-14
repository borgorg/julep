// tests/tools.test.ts

import { v4 as uuidv4 } from "uuid";
import { beforeAll, describe, expect, test } from "@jest/globals";

import { setupClient } from "./fixtures"; // Adjust the path as necessary

describe("Tools API", () => {
  let client: any;

  beforeAll(() => {
    client = setupClient();
  });

  test("tools.list", async () => {
    const agentId = uuidv4();
    const response = await client.tools.list(agentId);
    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty("type"); // Assuming 'Tool' objects have a 'type' property
  });

  test("tools.create", async () => {
    const response = await client.tools.create({
      agentId: uuidv4(),
      tool: {
        type: "function",
        function: {
          description: "test description",
          name: "test name",
          parameters: { test_arg: "test val" },
        },
      },
    });

    expect(response).toHaveProperty("createdAt");
    expect(Date.parse(response.createdAt)).toBeGreaterThan(0);
  });

  test("tools.update", async () => {
    const agentId = uuidv4();
    const toolId = uuidv4();

    const response = await client.tools.update({
      agentId,
      toolId,
      function: {
        description: "test description",
        name: "test name",
        parameters: { test_arg: "test val" },
      },
    });

    expect(response).toHaveProperty("updatedAt");
    expect(Date.parse(response.updatedAt)).toBeGreaterThan(0);
  });

  test("tools.delete", async () => {
    const response = await client.tools.delete({
      agentId: uuidv4(),
      toolId: uuidv4(),
    });

    expect(response).toBeUndefined();
  });
});