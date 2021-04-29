import { NgModule } from '@angular/core';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { ModelViewerWidget } from './model-viewer-widget.component';
import { ModelViewerWidgetConfig } from './model-viewer-widget-config.component';
import { ColorPickerComponent } from './color-picker/color-picker-component';
import { ColorSliderComponent } from './color-picker/color-slider/color-slider-component';
import { ColorPaletteComponent } from './color-picker/color-palette/color-palette-component';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [ModelViewerWidget, ModelViewerWidgetConfig, ColorPickerComponent, ColorSliderComponent, ColorPaletteComponent],
  entryComponents: [ModelViewerWidget, ModelViewerWidgetConfig],
  providers: [{
    provide: HOOK_COMPONENTS,
    multi: true,
    useValue: {
      id: 'com.softwareag.globalpresales.3dmodelviewerwidget',
      label: '3d model viewer',
      description: 'A runtime widget to view a 3d collada model (*.dae) in Cumulocity IoT. It has been developed by Global Presales team.',
      component: ModelViewerWidget,
      configComponent: ModelViewerWidgetConfig,
      previewImage: require("~assets/img-preview.png")
    }
  }],
})
export class ModelViewerWidgetAppModule {}
