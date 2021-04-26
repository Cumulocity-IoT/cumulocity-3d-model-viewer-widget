import { NgModule } from '@angular/core';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { ColladaWidget } from './collada-widget.component';
import { ColladaWidgetConfig } from './collada-widget-config.component';
import { ColorPickerComponent } from './color-picker/color-picker-component';
import { ColorSliderComponent } from './color-picker/color-slider/color-slider-component';
import { ColorPaletteComponent } from './color-picker/color-palette/color-palette-component';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [ColladaWidget, ColladaWidgetConfig, ColorPickerComponent, ColorSliderComponent, ColorPaletteComponent],
  entryComponents: [ColladaWidget, ColladaWidgetConfig],
  providers: [{
    provide: HOOK_COMPONENTS,
    multi: true,
    useValue: {
      id: 'com.softwareag.globalpresales.colladawidget',
      label: '3d collada',
      description: 'A runtime widget to view a 3d collada model (*.dae) in Cumulocity IoT. It has been developed by Global Presales team.',
      component: ColladaWidget,
      configComponent: ColladaWidgetConfig,
      previewImage: require("~assets/img-preview.png")
    }
  }],
})
export class ColladaWidgetAppModule {}
