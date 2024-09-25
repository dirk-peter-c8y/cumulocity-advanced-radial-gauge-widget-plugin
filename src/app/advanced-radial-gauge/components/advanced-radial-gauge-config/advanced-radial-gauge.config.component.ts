import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AdvancedRadialGaugeConfig } from '../../models/advanced-radial-gauge.model';
import {
  KPIDetails,
} from '@c8y/ngx-components/datapoint-selector';

@Component({
  selector: 'c8y-advanced-radial-gauge-config-component',
  templateUrl: './advanced-radial-gauge.config.component.html',
})
export class AdvancedRadialGaugeWidgetConfig implements OnInit {
  @Input() config!: AdvancedRadialGaugeConfig;

  datapoints: KPIDetails[];
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'datapoint.fragment',
              type: 'string',
              className: 'col-md-6',
              props: {
                label: 'Fragment',
                required: true,
              },
            },
            {
              key: 'datapoint.series',
              type: 'string',
              className: 'col-md-6',
              props: {
                label: 'Series',
                required: true,
              },
            },
          ],
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'datapoint.label',
              type: 'string',
              className: 'col-md-6',
              props: {
                label: 'Label',
              },
            },
            {
              key: 'datapoint.unit',
              type: 'string',
              className: 'col-md-6',
              props: {
                label: 'Unit',
                required: true,
              },
            },
          ],
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'datapoint.min',
              type: 'number',
              className: 'col-md-6',
              props: {
                label: 'Range Min',
                min: 0,
                step: 1,
              },
            },
            {
              key: 'datapoint.max',
              type: 'number',
              className: 'col-md-6',
              props: {
                label: 'Range Max',
                min: 0,
                step: 1,
              },
            },
          ],
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'datapoint.yellowRangeMin',
              type: 'number',
              className: 'col-md-6',
              props: {
                label: 'Yellow Start',
                min: 0,
                step: 1,
              },
            },
            {
              key: 'datapoint.redRangeMin',
              type: 'number',
              className: 'col-md-6',
              props: {
                label: 'Red Start',
                min: 0,
                step: 1,
              },
            },
          ],
        },
      ],
    },
  ];

  private isDev = false;

  constructor() {
    this.isDev = window.location.search.indexOf('dev=true') >= 0;
  }

  ngOnInit(): void {
    if (this.isDev) console.log('config init', this.config);
  }
}
