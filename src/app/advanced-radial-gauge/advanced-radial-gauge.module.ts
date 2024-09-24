import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CoreModule,
  MeasurementRealtimeService,
  hookComponent,
} from '@c8y/ngx-components';
import { FormlyModule } from '@ngx-formly/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxGaugeModule } from 'ngx-gauge';
import { AdvancedRadialGaugeWidgetConfig } from './components/advanced-radial-gauge-config/advanced-radial-gauge.config.component';
import { AdvancedRadialGaugeWidget } from './components/advanced-radial-gauge/advanced-radial-gauge.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    TooltipModule,
    NgxGaugeModule,
    FormlyModule.forChild(),
    BsDropdownModule,
  ],
  declarations: [AdvancedRadialGaugeWidget, AdvancedRadialGaugeWidgetConfig],
  providers: [
    MeasurementRealtimeService,
    hookComponent({
      id: 'advanced-radial-gauge.widget',
      label: 'Advenced Radial Gauge',
      description:
        'Cumulocity Advanced Radial Gauge Widget shows the latest realtime measurement on a radial gauge.',
      component: AdvancedRadialGaugeWidget,
      configComponent: AdvancedRadialGaugeWidgetConfig,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      previewImage: require('./assets/preview.png'),
      data: {
        settings: {
          noNewWidgets: false,
          ng1: {
            options: {
              noDeviceTarget: false,
              groupsSelectable: false,
            },
          },
        },
      },
    }),
  ],
})
export class AdvancedRadialGaugeModule {}
