import { buildDocsAuditPlan } from './docs-audit.js';
import { buildSignupSmokeTestPlan } from './signup-smoke-test.js';
import { buildPricingWatchPlan } from './pricing-watch.js';

export const workflowBuilders = {
  'docs-audit': buildDocsAuditPlan,
  'signup-smoke-test': buildSignupSmokeTestPlan,
  'pricing-watch': buildPricingWatchPlan
};
