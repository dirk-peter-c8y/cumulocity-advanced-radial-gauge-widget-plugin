import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IMeasurement, MeasurementService } from '@c8y/client';
import { MeasurementRealtimeService } from '@c8y/ngx-components';
import { cloneDeep, round } from 'lodash';
import {
  ADVANCED_RADIAL_GAUGE_CHART_CONFIG,
  AdvancedRadialGaugeChartConfig,
  AdvancedRadialGaugeChartMarkerType,
  AdvancedRadialGaugeConfig,
} from '../../models/advanced-radial-gauge.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'c8y-advanced-radial-gauge-widget',
  templateUrl: './advanced-radial-gauge.component.html',
  styleUrl: './advanced-radial-gauge.component.scss',
})
export class AdvancedRadialGaugeWidget implements OnInit, OnDestroy {
  private measurementService = inject(MeasurementService);
  private measurementRealtimeService = inject(MeasurementRealtimeService);

  @Input() config?: AdvancedRadialGaugeConfig;

  // chart
  chartConfig: AdvancedRadialGaugeChartConfig = cloneDeep(
    ADVANCED_RADIAL_GAUGE_CHART_CONFIG
  );
  value?: number;
  lastUpdated?: string;
  loading = true;

  private subscription?: Subscription;
  private isDev = false;

  constructor() {
    this.isDev = window.location.search.indexOf('dev=true') >= 0;
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    // chart config
    this.chartConfig.min = this.config.datapoint?.min;
    this.chartConfig.max = this.config.datapoint?.max;
    this.chartConfig.thresholds = this.generateThresholds();
    this.chartConfig.markers = this.generateMarkers();

    // measurements
    await this.fetchLatestMeasurement();
    this.setupMeasurementSubscription();

    this.loading = false;
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

    this.handleMeasurementUpdate(response.data[0]);
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
    if (this.isDev) console.log('[ARGW.C] Measurement', measurement);

    this.value = round(
      measurement[this.config.datapoint.fragment][this.config.datapoint.series]
        .value,
      1
    );
    this.lastUpdated = measurement.time;
    this.chartConfig.unit = this.config.datapoint.unit || measurement['unit'];
  }

  private generateThresholds(): AdvancedRadialGaugeChartConfig['thresholds'] {
    return {
      '0': {
        color: 'green',
        bgOpacity: 0.2,
      },
      [this.config.datapoint.yellowRangeMin as number]: {
        color: 'orange',
        bgOpacity: 0.2,
      },
      [this.config.datapoint.redRangeMin as number]: {
        color: 'red',
        bgOpacity: 0.2,
      },
    };
  }

  private generateMarkers() {
    const markers = {
      [this.chartConfig.min as number]: this.generateLineMarker(
        this.chartConfig.min
      ),
      [this.chartConfig.max as number]: this.generateLineMarker(
        this.chartConfig.max
      ),
    };

    const total =
      (this.chartConfig.max as number) - (this.chartConfig.min as number);
    const steps = 10;
    const part = total / steps;
    let index = 0;

    for (
      let step = (this.chartConfig.min as number) + part;
      step < (this.chartConfig.max as number);
      step += part
    ) {
      markers[step] = this.generateLineMarker(
        steps > 5 && index % 2 === 0 ? 0 : step // TODO check null : step
      );
      index++;
    }

    if (this.isDev) console.log('[ARGW.C] Markers', markers);

    return markers;
  }

  private generateLineMarker(label?: string | number) {
    const lineMarkerBase = {
      color: '#888',
      type: AdvancedRadialGaugeChartMarkerType.line,
      size: 6,
    };

    if (typeof label === 'number') label = Math.round(label).toString();
    else if (!label) return lineMarkerBase;

    return {
      ...lineMarkerBase,
      ...{
        label,
      },
    };
  }
}
