import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IMeasurement, MeasurementService } from '@c8y/client';
import { MeasurementRealtimeService } from '@c8y/ngx-components';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { ADVANCED_RADIAL_GAUGE__DEFAULT_CONFIG } from '../../models/advanced-radial-gauge.const';
import {
  AdvancedRadialGaugeChartConfig,
  AdvancedRadialGaugeConfig,
} from '../../models/advanced-radial-gauge.model';

@Component({
  selector: 'c8y-advanced-radial-gauge-widget',
  templateUrl: './advanced-radial-gauge.component.html',
  styleUrl: './advanced-radial-gauge.component.scss',
})
export class AdvancedRadialGaugeWidget implements OnInit, OnDestroy {
  @Input() config: AdvancedRadialGaugeConfig = cloneDeep(
    ADVANCED_RADIAL_GAUGE__DEFAULT_CONFIG
  );

  // chart
  chartConfig: AdvancedRadialGaugeChartConfig = {
    min: 0,
    max: 100,
    unit: '',
    thresholds: {
      '0': { color: 'green' },
      '40': { color: 'orange' },
      '75.5': { color: 'red' },
    },
  };

  value: number;
  lastUpdated: string;

  private subscription: Subscription;

  constructor(
    private measurementService: MeasurementService,
    private measurementRealtimeService: MeasurementRealtimeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.chartConfig.min = this.config.datapoint.min;
    this.chartConfig.max = this.config.datapoint.max;
    this.chartConfig.thresholds = {
      '0': { color: 'green' },
      [this.config.datapoint.yellowRangeMin]: { color: 'orange' },
      [this.config.datapoint.redRangeMin]: { color: 'red' },
    };

    await this.fetchLatestMeasurement();
    this.setupMeasurementSubscription();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private async fetchLatestMeasurement(): Promise<void> {
    const response = await this.measurementService.list({
      source: this.config.device.id,
      type: this.config.datapoint.fragment,
      dateFrom: '1970-01-01',
      revert: true,
      pageSize: 1,
    });

    if (!response.data.length) return;

    const measurement =
      response.data[0][this.config.datapoint.fragment][
        this.config.datapoint.series
      ];

    this.value = measurement.value;
    this.chartConfig.unit = this.config.datapoint.unit || measurement.unit;
  }

  private setupMeasurementSubscription() {
    this.subscription = this.measurementRealtimeService
      .onCreateOfSpecificMeasurement$(
        this.config.datapoint.fragment,
        this.config.datapoint.series,
        this.config.device.id
      )
      .subscribe((measurement) => this.handleMeasurementUpdate(measurement));
  }

  private handleMeasurementUpdate(measurement: IMeasurement): void {
    // time fragment.series.value/unit
    console.log(measurement);
    this.value =
      measurement[this.config.datapoint.fragment][
        this.config.datapoint.series
      ].value;
    this.lastUpdated = measurement.time;
  }
}
