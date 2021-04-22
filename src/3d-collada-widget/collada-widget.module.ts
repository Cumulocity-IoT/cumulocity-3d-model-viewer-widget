import { NgModule } from '@angular/core';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { ColladaWidget } from './collada-widget.component';
import { ColladaWidgetConfig } from './collada-widget-config.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CoreModule,
    HttpClientModule
  ],
  declarations: [ColladaWidget, ColladaWidgetConfig],
  entryComponents: [ColladaWidget, ColladaWidgetConfig],
  providers: [{
    provide: HOOK_COMPONENTS,
    multi: true,
    useValue: [
      {
        id: 'com.softwareag.globalpresales.colladawidget',
        label: '3D Collada',
        description: 'This widget shows the latest measurement value and unit received from a device as a KPI. It compares this measurement value with the average of measurements received in the selected interval and calculated the percentage growth or fall. It allows to configure threshold values to change the KPI color when threshold values are reached. It also shows a trend chart by plotting all the measurement values received for the selected interval or measurements count.',
        component: ColladaWidget,
        configComponent: ColladaWidgetConfig,
        previewImage: require("~assets/img-preview.png")
      }
    ]
  }],
})
export class ColladaWidgetAppModule {}
