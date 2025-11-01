import { PlanType } from './types';

export const PLAN_PRICES: Record<PlanType, number> = {
  [PlanType.ONE_MONTH]: 1000,
  [PlanType.THREE_MONTHS]: 3000,
  [PlanType.SIX_MONTHS]: 6000,
  [PlanType.TWELVE_MONTHS]: 12000,
};

export const PLAN_DURATIONS_MONTHS: Record<PlanType, number> = {
  [PlanType.ONE_MONTH]: 1,
  [PlanType.THREE_MONTHS]: 3,
  [PlanType.SIX_MONTHS]: 6,
  [PlanType.TWELVE_MONTHS]: 12,
};