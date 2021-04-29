import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as NgRouterModule } from '@angular/router';
import { UpgradeModule as NgUpgradeModule } from '@angular/upgrade/static';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import {
  DashboardUpgradeModule,
  UpgradeModule,
  HybridAppModule,
  UPGRADE_ROUTES
} from '@c8y/ngx-components/upgrade';
import { AssetsNavigatorModule } from '@c8y/ngx-components/assets-navigator';
import { CockpitDashboardModule } from '@c8y/ngx-components/context-dashboard';
import { ReportsModule } from '@c8y/ngx-components/reports';
import { SensorPhoneModule } from '@c8y/ngx-components/sensor-phone';
import { ModelViewerWidget } from './src/model-viewer-widget/model-viewer-widget.component';
import { ModelViewerWidgetConfig } from './src/model-viewer-widget/model-viewer-widget-config.component';
import { ColorPaletteComponent } from './src/model-viewer-widget/color-picker/color-palette/color-palette-component';
import { ColorSliderComponent } from './src/model-viewer-widget/color-picker/color-slider/color-slider-component';
import { ColorPickerComponent } from './src/model-viewer-widget/color-picker/color-picker-component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgRouterModule.forRoot([...UPGRADE_ROUTES], { enableTracing: false, useHash: true }),
    CoreModule.forRoot(),
    AssetsNavigatorModule,
    ReportsModule,
    NgUpgradeModule,
    DashboardUpgradeModule,
    CockpitDashboardModule,
    SensorPhoneModule,
    UpgradeModule
  ],
  declarations: [ModelViewerWidget, ModelViewerWidgetConfig, ColorPickerComponent, ColorSliderComponent, ColorPaletteComponent],
  entryComponents: [ModelViewerWidget, ModelViewerWidgetConfig],
  providers: [{
    provide: HOOK_COMPONENTS,
    multi: true,
    useValue: [
      {
        id: 'com.softwareag.globalpresales.3dmodelviewerwidget',
        label: '3d model viewer',
        description: 'A runtime widget to view a 3d collada model (*.dae) in Cumulocity IoT. It has been developed by Global Presales team.',
        component: ModelViewerWidget,
        configComponent: ModelViewerWidgetConfig,
        previewImage: require("./assets/img-preview.png")
      }
    ]
  }],
})
export class AppModule extends HybridAppModule {
  constructor(protected upgrade: NgUpgradeModule) {
    super();
  }
}
