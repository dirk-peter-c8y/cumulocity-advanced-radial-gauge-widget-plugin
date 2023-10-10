/*
* Copyright (c) 2019 Software AG, Darmstadt, Germany and/or its licensors
*
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */
import { Component, Input, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, NgForm, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { FetchClient, IFetchResponse } from '@c8y/client';
import * as _ from 'lodash';
import {
    DatapointAttributesFormConfig,
    DatapointSelectorModalOptions,
    KPIDetails,
  } from '@c8y/ngx-components/datapoint-selector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

  export function exactlyASingleDatapointActive(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const datapoints: any[] = control.value;
      if (!datapoints || !datapoints.length) {
        return null;
      }
      const activeDatapoints = datapoints.filter(datapoint => datapoint.__active);
      if (activeDatapoints.length === 1) {
        return null;
      }
      return { exactlyOneDatapointNeedsToBeActive: true };
    };
  }

@Component({
    selector: "advanced-radial-gauge-config-component",
    templateUrl: "./advanced-radial-gauge.config.component.html",
    styleUrls: ["./advanced-radial-gauge.config.component.css"]
})
export class AdvancedRadialGaugeConfig implements OnInit, OnDestroy, DoCheck {

    @Input() config: any = {};
    datapointSelectDefaultFormOptions: Partial<DatapointAttributesFormConfig> = {
        showRange: false,
        showChart: false,
      };
    datapointSelectionConfig: Partial<DatapointSelectorModalOptions> = {};
    formGroup: ReturnType<AdvancedRadialGaugeConfig['createForm']>;
    configDevice = null;
    oldDeviceId: string = '';
    public supportedSeries: string[];
    public measurementSeriesDisabled: boolean = false;

    public widgetInfo = {
        creationTimestamp: Date.now(),
        label: {
            text: 'Speed',
            fontSize: 15,
            hyperlink: ''
        },
        startValue: 0,
        measurement: {
            supportedSeries: [],
            name: '',
            fontSize: 15,
            decimalDigits: 2
        },
        gauge: {
            indicatorType: 'pointer',
            axisWidth: 10,
            axisLabelDistance: -20,
            progressBar: {
                color: '#0B385B'
            },
            pointer: {
                offset: -75
            }
        },
        ranges: [
            {
                limitValue: 100,
                color: '#1776bf'
            }
        ]
    };
    private destroy$ = new Subject<void>();
    constructor(private fetchClient: FetchClient, private formBuilder: FormBuilder, private form: NgForm) {}
    
    ngOnInit(): void {
        // Editing an existing widget
        if (this.config.device && this.config.device.id) {
            this.configDevice = this.config.device.id;
            this.datapointSelectionConfig.contextAsset = this.config.device;
            this.datapointSelectionConfig.assetSelectorConfig;
          }
        if(_.has(this.config, 'customwidgetdata')) {
            this.loadFragmentSeries();
            this.widgetInfo = _.get(this.config, 'customwidgetdata');
        } else { // Adding a new widget
            _.set(this.config, 'customwidgetdata', this.widgetInfo);
        }
        this.initForm();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        this.config.datapoints = [ ...value.datapoints ];
      });
    }

    public addRange() {
        this.widgetInfo.ranges.push({
            limitValue: 150,
            color: '#000000'
        });
        this.updateConfig();
    }

    public deleteRange(index: number) {
        this.widgetInfo.ranges.splice(index, 1);
        this.updateConfig();
    }

    public updateConfig() {
        _.set(this.config, 'customwidgetdata', this.widgetInfo);
    }

    public async loadFragmentSeries(): Promise<void> {
        if( !_.has(this.config, "device.id")) {
            console.log("Advanced Radial Gauge Widget - Cannot get fragment series because device id is blank.");
        } else {
            if(this.oldDeviceId !== this.config.device.id) {
                this.fetchClient.fetch('/inventory/managedObjects/'+ this.config.device.id +'/supportedSeries').then((resp: IFetchResponse) => {
                    this.measurementSeriesDisabled = false;
                    if(resp !== undefined) {
                        resp.json().then((jsonResp) => {
                            this.widgetInfo.measurement.supportedSeries = jsonResp.c8y_SupportedSeries;
                            if(!this.widgetInfo.measurement.supportedSeries.includes(this.widgetInfo.measurement.name)) {
                                this.widgetInfo.measurement.name = "";
                            }
                            this.updateConfig();
                        });
                    }
                    this.oldDeviceId = this.config.device.id;
                });
            }
        }
    }

    ngDoCheck(): void {
        if (this.config.device && this.config.device.id !== this.configDevice) {
          this.configDevice = this.config.device.id;
          const context = this.config.device;
          if (context?.id) {
            this.datapointSelectionConfig.contextAsset = context;
            this.datapointSelectionConfig.assetSelectorConfig
          }
        }
      }
    ngOnDestroy(): void {
        //unsubscribe from observables here
    }

    private initForm(): void {
        this.formGroup = this.createForm();
        this.form.form.addControl('config', this.formGroup);
        if (this.config?.datapoints) {
          this.formGroup.patchValue({ datapoints: this.config.datapoints });
        }
      }

    private createForm() {
        return this.formBuilder.group({
          datapoints: this.formBuilder.control(new Array<KPIDetails>(), [
            Validators.required,
            Validators.minLength(1),
            exactlyASingleDatapointActive()
          ])
        });
      }

    
}
