import { ISource } from "@c8y/client";

export interface AdvancedRadialGaugeConfig {
  datapoint: Datapoint;
  device: ISource;
}

export interface AdvancedRadialGaugeChartConfig {
  min?: number;
  max?: number;
  unit: string;
  thresholds: {
    [key: string]: { color: string }
  };
  markers: {}
}

export interface Datapoint {
  fragment: string;
  label: string;
  max: number;
  min: number;
  redRangeMax: number;
  redRangeMin: number;
  series: string;
  unit: string;
  yellowRangeMax: number;
  yellowRangeMin: number;
  [key: string]: string | number;
}
