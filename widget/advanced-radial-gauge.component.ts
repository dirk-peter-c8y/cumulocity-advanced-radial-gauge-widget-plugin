/**
 * /*
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
 *
 * @format
 */

import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MeasurementService, Realtime } from "@c8y/client";
import * as _ from 'lodash';
import * as echarts from "echarts";
import { formatDate } from '@angular/common';
import { ResizedEvent } from 'angular-resize-event';
import { EChartsOption } from 'echarts';
@Component({
    selector: "lib-advanced-radial-gauge",
    templateUrl: "./advanced-radial-gauge.component.html",
    styleUrls: ["./advanced-radial-gauge.component.css"],
})
export class AdvancedRadialGauge implements OnDestroy, OnInit, AfterViewInit {

    @Input() config;

    public uniqueId = "";

    public topMargin = "";

    private radialGauge: echarts.ECharts;
    radialChartOption: EChartsOption = {};
     width: number;
     height: number;
    
    private deviceId = '';
    private label = {
        text: '',
        fontSize: 15,
        hyperlink: ''
    };
    private measurement = {
        fullname: '',
        fragment: '',
        series: '',
        fontSize: 15,
        decimalDigits: 0
    };
    private gauge = {
        indicatorType: 'pointer',
        axisWidth: 10,
        axisLabelDistance: -15,
        progressBar: {
            color: '#000000'
        },
        pointer: {
            offset: -75
        }
    };
    private startValue = 0;
    private ranges = [];
    private axisLineColors = [];
    private maxValue = 0;
    private subscription;
    private title = "";
    private lastMeasurement = {
        value: 0,
        unit: ''
    };

    constructor(private realtime: Realtime, private measurementService: MeasurementService) { }

    async ngOnInit(): Promise<void> {
        try {

            // Create Timestamp
            let creationTimeStamp = _.get(this.config, 'customwidgetdata.creationTimestamp');
            if (creationTimeStamp === undefined || creationTimeStamp === null) {
                throw new Error("Creation timestamp is blank.");
            } else {
                this.uniqueId = "id-" + creationTimeStamp;
            }

            // Device ID
            this.deviceId = _.get(this.config, 'device.id');
            if (this.deviceId === undefined || this.deviceId === null || this.deviceId === "") {
                throw new Error("Device id is blank.");
            }

            // Measurement
            this.measurement.fullname = _.get(this.config, 'customwidgetdata.measurement.name');
            if (this.measurement.fullname === undefined || this.measurement.fullname === null || this.measurement.fullname === "") {
                throw new Error("Measurement is blank.");
            } else {
                this.measurement.fragment = this.measurement.fullname.split(".")[0];
                this.measurement.series = this.measurement.fullname.split(".")[1];
            }

            // Measurement Font Size
            this.measurement.fontSize = _.get(this.config, 'customwidgetdata.measurement.fontSize');
            if (this.measurement.fontSize === undefined || this.measurement.fontSize === null) {
                this.measurement.fontSize = 15;
            }

            // Measurement Decimal Digits
            this.measurement.decimalDigits = _.get(this.config, 'customwidgetdata.measurement.decimalDigits');
            if (this.measurement.decimalDigits === undefined || this.measurement.decimalDigits < 0) {
                this.measurement.decimalDigits = 0;
            }

            // Gauge Indicator Type
            this.gauge.indicatorType = _.get(this.config, 'customwidgetdata.gauge.indicatorType');

            // Gauge Axis Width
            this.gauge.axisWidth = _.get(this.config, 'customwidgetdata.gauge.axisWidth');
            if (this.gauge.axisWidth === undefined || this.gauge.axisWidth <= 0) {
                this.gauge.axisWidth = 1;
            }

            // Gauge Axis Label Distance
            this.gauge.axisLabelDistance = _.get(this.config, 'customwidgetdata.gauge.axisLabelDistance');
            if (this.gauge.axisLabelDistance === undefined) {
                this.gauge.axisLabelDistance = -20;
            }

            // Gauge Progress Bar Color
            this.gauge.progressBar.color = _.get(this.config, 'customwidgetdata.gauge.progressBar.color');

            // Gauge Pointer Offset
            this.gauge.pointer.offset = _.get(this.config, 'customwidgetdata.gauge.pointer.offset');
            if (this.gauge.pointer.offset === undefined) {
                this.gauge.pointer.offset = -75;
            }

            // Label Text
            this.label.text = _.get(this.config, 'customwidgetdata.label.text');
            if (this.label.text === undefined || this.label.text === null) {
                this.label.text = "";
            }

            // Label Font Size
            this.label.fontSize = _.get(this.config, 'customwidgetdata.label.fontSize');
            if (this.label.fontSize === undefined || this.label.fontSize === null) {
                this.label.fontSize = 15;
            }

            // Label Hyperlink
            this.label.hyperlink = _.get(this.config, 'customwidgetdata.label.hyperlink');
            if (this.label.hyperlink === undefined || this.label.hyperlink === null) {
                this.label.hyperlink = "";
            }

            // Guage Start Value
            this.startValue = _.get(this.config, 'customwidgetdata.startValue');
            if (this.startValue === undefined) {
                this.startValue = 0;
            }

            // Guage Ranges
            this.ranges = _.get(this.config, 'customwidgetdata.ranges');
            if (this.ranges === undefined || this.ranges.length === 0) {
                throw new Error("Ranges not defined.");
            } else {
                this.maxValue = this.ranges[this.ranges.length - 1].limitValue;
                this.ranges.forEach((r) => {
                    this.axisLineColors.push(
                        [(r.limitValue - this.startValue) / (this.maxValue - this.startValue), r.color]
                    );
                });
            }

            // Set Title
            if (this.label.text !== "") {
                if (this.label.hyperlink === "") {
                    this.title = this.label.text;
                } else {
                    this.title = this.label.text + " \u{1F855}";
                }
            }
        } catch (e) {
            console.log("Advanced Radial Guage Widget - " + e);
        }
    }

    async ngAfterViewInit() {
        try {
            // Get Last Measurement Value to start with
            let resp = await this.getLastMeasurement(this.deviceId, this.measurement.fragment, this.measurement.series);
            if (resp.data.length === 1) {
                this.lastMeasurement.value = resp.data[0][this.measurement.fragment][this.measurement.series].value;
                if (resp.data[0][this.measurement.fragment][this.measurement.series].unit !== undefined && resp.data[0][this.measurement.fragment][this.measurement.series].unit !== null) {
                    this.lastMeasurement.unit = resp.data[0][this.measurement.fragment][this.measurement.series].unit;
                }

            }
            this.configureTopMarginRequired();
            // Show Chart
            this.showChart();
        } catch (e) {
            console.log("Advanced Radial Gauge Widget - " + e);
        }
    }

    private showChart(): void {
        let chartDom = document.getElementById(this.uniqueId)!;
        this.radialGauge = echarts.init(chartDom);
        let option: echarts.EChartsOption;

        let me = this;
        this.radialChartOption = {
            title: {
                text: this.title,
                left: 'center',
                bottom: '0%',
                textStyle: {
                    fontSize: this.label.fontSize,
                },
                link: this.label.hyperlink
            },
            series: [{
                type: 'gauge',
                center: ['50%', '80%'],
                startAngle: 190,
                endAngle: -10,
                min: this.startValue,
                max: this.maxValue,
                splitNumber: 10,
                radius: '100%',

                progress: {
                    show: (this.gauge.indicatorType === 'progressbar'),
                    width: this.gauge.axisWidth / 2,
                    itemStyle: {
                        color: this.gauge.progressBar.color
                    }
                },
                pointer: {
                    show: (this.gauge.indicatorType === 'pointer'),
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '12%',
                    width: 20,
                    offsetCenter: [0, this.gauge.pointer.offset + '%'],
                    itemStyle: {
                        color: 'inherit'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: this.gauge.axisWidth,
                        color: this.axisLineColors
                    }
                },
                axisTick: {
                    distance: this.gauge.axisWidth - ((this.gauge.axisWidth * 2) + 10),
                    splitNumber: 5,
                    lineStyle: {
                        width: 3,
                        color: 'inherit'
                    }
                },
                splitLine: {
                    distance: this.gauge.axisWidth - ((this.gauge.axisWidth * 2) + 15),
                    length: 8,
                    lineStyle: {
                        width: 3,
                        color: 'auto'
                    }
                },
                axisLabel: {
                    distance: this.gauge.axisLabelDistance,
                    color: 'inherit',
                    fontSize: 10
                },
                anchor: {
                    show: false
                },
                title: {
                    show: false,
                    fontSize: this.label.fontSize
                },
                detail: {
                    valueAnimation: true,
                    fontSize: this.measurement.fontSize,
                    color: this.gauge.indicatorType === 'progressbar' ? this.gauge.progressBar.color : 'inherit',
                    offsetCenter: [0, '0%'],
                    width: '30%',
                    formatter: function (value) {
                        return value.toFixed(me.measurement.decimalDigits) + ' ' + me.lastMeasurement.unit
                    }
                },
                data: [{
                    value: this.lastMeasurement.value,
                }]
            }]
        };
        // Subscribe realtime to measurement
        this.subscription = this.realtime.subscribe('/measurements/' + this.deviceId, (data) => {
            try {
                if (data.data.data[this.measurement.fragment] !== undefined && data.data.data[this.measurement.fragment][this.measurement.series] !== undefined) {
                    this.lastMeasurement.value = data.data.data[me.measurement.fragment][me.measurement.series].value;
                    this.lastMeasurement.unit = "";
                    if (data.data.data[me.measurement.fragment][me.measurement.series].unit !== undefined && data.data.data[me.measurement.fragment][me.measurement.series].unit !== null) {
                        this.lastMeasurement.unit = data.data.data[me.measurement.fragment][me.measurement.series].unit;
                    }
                    this.radialGauge.setOption<echarts.EChartsOption>({
                        series: [
                            {
                                detail: {
                                    formatter: function (value) {
                                        return value.toFixed(me.measurement.decimalDigits) + ' ' + me.lastMeasurement.unit;
                                    }
                                },
                                data: [
                                    {
                                        value: me.lastMeasurement.value
                                    }
                                ]
                            }
                        ]
                    });
                }
            } catch (e) {
                console.log("Advanced Radial Gauge Widget - " + e);
            }
        })

        // Uncomment this code to test locally. Comment the above realtime subscription.
        /*let me1 = this;
        setInterval(function () {
            const random = +(Math.random() * 60).toFixed(2);
            me1.radialGauge.setOption<echarts.EChartsOption>({
                series: [
                    {
                        detail : {
                            formatter: function(value) {
                                return value.toFixed(me.measurement.decimalDigits) + ' kmph';
                            }
                        },
                        data: [
                            {
                                value: random
                            }
                        ]
                    }
                ]
            });
        }, 2000);*/
        this.radialChartOption && this.radialGauge.setOption(this.radialChartOption);
    }

    private async getLastMeasurement(deviceId: string, fragment: string, series: string) {
        const datetimeFormat: string = 'yyyy-MM-ddTHH:mm:ssZ';
        let currentDatetime = new Date();
        let oldDatetime = new Date();
        const filter = {
            source: deviceId,
            dateFrom: formatDate(oldDatetime.setFullYear(1990), datetimeFormat, 'en'),
            dateTo: formatDate(currentDatetime, datetimeFormat, 'en'),
            valueFragmentType: fragment,
            valueFragmentSeries: series,
            pageSize: 1,
            revert: true
        }
        const resp = await this.measurementService.list(filter);
        return resp;
    }

    // Configure top margin within the widget. This is on the basis if the Widget title is set to hidden or not.
    private configureTopMarginRequired(): void {
        let allWidgets: NodeListOf<Element> = document.querySelectorAll('.dashboard-grid-child');
        allWidgets.forEach((w: Element) => {
            let widgetElement: Element = w.querySelector('div > div > div > c8y-dynamic-component > lib-advanced-radial-gauge');
            if (widgetElement !== undefined && widgetElement !== null) {
                let widgetTitleElement: Element = w.querySelector('div > div > div > c8y-dashboard-child-title');
                const widgetTitleDisplayValue: string = window.getComputedStyle(widgetTitleElement).getPropertyValue('display');
                if (widgetTitleDisplayValue !== undefined && widgetTitleDisplayValue !== null && widgetTitleDisplayValue === 'none') {
                    this.topMargin = '10px';
                } else {
                    this.topMargin = '0';
                }
            }
        });
    }

    // Event called on resize of chart box
    onChartResized(event: ResizedEvent) {
        this.width = event.newWidth;
        this.height = event.newHeight;
        if (this.radialGauge) {
            this.radialGauge.resize({
                width: this.width,
                height: this.height
            });
        }
    }
    ngOnDestroy(): void {
        //unsubscribe from observables here
        try {
            if (this.subscription !== undefined && this.subscription !== null) {
                this.realtime.unsubscribe(this.subscription);
            }
        } catch (e) {
            console.log("Advanced Radial Gauge Widget - " + e);
        }

    }
}
