import { DEFAULT_LHV_MJ_PER_TONNE, TARGET_2025 } from "../../shared/constants";

export function computeCB(actualGhgIntensity: number, fuelConsumptionTonnes: number, target = TARGET_2025) {
  const energyMJ = fuelConsumptionTonnes * DEFAULT_LHV_MJ_PER_TONNE;
  const cb = (target - actualGhgIntensity) * energyMJ; // gCO2e
  return { energyMJ, cb };
}
