import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export function setupTracing() {
  const sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  });
  sdk.start();
}
