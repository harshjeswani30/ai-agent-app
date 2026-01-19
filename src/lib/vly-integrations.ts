import { VlyIntegrations } from "@vly-ai/integrations";

// Lazy initialization to avoid errors during module loading
let vlyInstance: VlyIntegrations | null = null;

export const vly = {
  get ai() {
    if (!vlyInstance) {
      const deploymentToken = process.env.VLY_INTEGRATION_KEY;
      if (!deploymentToken) {
        throw new Error("VLY_INTEGRATION_KEY environment variable is not set. Please add it in the API Keys tab.");
      }
      vlyInstance = new VlyIntegrations({ deploymentToken });
    }
    return vlyInstance.ai;
  }
};