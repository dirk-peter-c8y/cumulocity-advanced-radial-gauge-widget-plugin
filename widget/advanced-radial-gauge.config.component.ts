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
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlContainer, NgForm } from "@angular/forms";
import { FetchClient, IFetchResponse } from '@c8y/client';
import * as _ from 'lodash';

@Component({
    selector: "advanced-radial-gauge-config-component",
    templateUrl: "./advanced-radial-gauge.config.component.html",
    styleUrls: ["./advanced-radial-gauge.config.component.css"]
})
export class AdvancedRadialGaugeConfig implements OnInit, OnDestroy {

    @Input() config: any = {};
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

    constructor(private fetchClient: FetchClient) {}
    
    ngOnInit(): void {
        // Editing an existing widget
        if(_.has(this.config, 'customwidgetdata')) {
            this.loadFragmentSeries();
            this.widgetInfo = _.get(this.config, 'customwidgetdata');
        } else { // Adding a new widget
            _.set(this.config, 'customwidgetdata', this.widgetInfo);
        }
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

    ngOnDestroy(): void {
        //unsubscribe from observables here
    }


    
}