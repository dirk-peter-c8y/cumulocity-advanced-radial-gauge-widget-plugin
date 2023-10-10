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
 * 
 */

import { CommonModule, CoreModule, DynamicDatapointsResolver, HOOK_COMPONENTS } from "@c8y/ngx-components";
import { AdvancedRadialGaugeConfig } from "./advanced-radial-gauge.config.component";
import { AdvancedRadialGauge } from "./advanced-radial-gauge.component";
import { NgModule } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts";
import { AngularResizedEventModule } from "angular-resize-event";
import { DatapointSelectorModule } from '@c8y/ngx-components/datapoint-selector';

@NgModule({
    imports: [CoreModule, CommonModule, NgxEchartsModule, AngularResizedEventModule, DatapointSelectorModule],
    declarations: [AdvancedRadialGauge, AdvancedRadialGaugeConfig],
    entryComponents: [AdvancedRadialGauge, AdvancedRadialGaugeConfig],
    providers: [
        {
            provide: HOOK_COMPONENTS,
            multi: true,
            useValue: {
                id: "global.presales.advanced.radial.gauge.widget",
                label: "Advanced Radial Gauge",
                description: "Cumulocity IoT Advanced Radial Gauge Widget",
                component: AdvancedRadialGauge,
                configComponent: AdvancedRadialGaugeConfig,
                previewImage: require("./assets/img-preview.png"),
                resolve: {
                    datapoints: DynamicDatapointsResolver,
                  },
                 data: {
                    ng1: {
                        options: {
                            noDeviceTarget: false,
                            noNewWidgets: false,
                            deviceTargetNotRequired: false,
                            groupsSelectable: true
                        },
                    },
                }, 
            },
        }
    ],
})
export class AdvancedRadialGaugeModule { }
