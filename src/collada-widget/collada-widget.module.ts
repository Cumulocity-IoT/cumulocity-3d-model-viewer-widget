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
        description: 'This is a 3D Collada Widget for Cumulocity IoT.',
        component: ColladaWidget,
        configComponent: ColladaWidgetConfig,
        previewImage: require("~assets/img-preview.png")
      }
    ]
  }],
})
export class ColladaWidgetAppModule {}
