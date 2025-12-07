export enum HealthStatus {
  THRIVING = 'Thriving',
  RECOVERING = 'Recovering',
  CRITICAL = 'Critical',
}

export interface CareSchedule {
  waterFrequencyDays: number;
  lastWatered: string; // ISO Date string
  nextWatering: string; // ISO Date string

  mistFrequencyDays?: number; // 0 or undefined means never/not needed
  lastMisted?: string;
  nextMisting?: string;

  fertilizeFrequencyDays?: number; // 0 or undefined means never/not needed
  lastFertilized?: string;
  nextFertilizing?: string;
}

export interface DiagnosisResult {
  plantName: string;
  scientificName: string;
  confidence: number;
  healthStatus: HealthStatus;
  diagnosis: string;
  reasoning: string;
  carePlan: string[];
  suggestedWaterFrequency: number;
  suggestedMistFrequency?: number;
  suggestedFertilizeFrequency?: number;
}

export interface Plant {
  id: string;
  name: string; // Nickname
  species: string;
  imageUrl: string;
  acquiredDate: string;
  status: HealthStatus;
  schedule: CareSchedule;
  diagnosisHistory: DiagnosisResult[];
}

export type ViewState = 'dashboard' | 'camera' | 'plant-detail' | 'expert' | 'premium';

export interface ViewProps {
  changeView: (view: ViewState, plantId?: string) => void;
}