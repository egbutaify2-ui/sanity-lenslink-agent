import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "kv3pdv23",
    dataset: "production",
  },
  deployment: {
    autoUpdates: true,
  },
});
