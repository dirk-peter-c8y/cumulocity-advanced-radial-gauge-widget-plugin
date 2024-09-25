import { ISource } from '@c8y/client';
import { KPIDetails } from '@c8y/ngx-components/datapoint-selector';

export interface AdvancedRadialGaugeConfig {
  datapoint: KPIDetails;
  device: ISource;
}

export const AdvancedRadialGaugeChartmarkerType = {
  line: 'line',
  triangle: 'triangle',
}
export type AdvancedRadialGaugeChartmarkerType =
  (typeof AdvancedRadialGaugeChartmarkerType)[keyof typeof AdvancedRadialGaugeChartmarkerType];

export interface AdvancedRadialGaugeChartConfig {
  min?: number;
  max?: number;
  unit?: string;
  thresholds: {
    [key: string]: {
      color: string;
      bgOpacity?: number;
    };
  };
  markers: {
    [key: string]: {
      color: string;
      type: AdvancedRadialGaugeChartmarkerType;
      size?: number;
      label?: string;
    };
  };
}
