# 3D Model Viewer Widget for Cumulocity IoT

This is a runtime widget to view a 3D collada model (*.dae, *.obj, *.gltf) in Cumulocity IoT.

<img src="/assets/img-preview.png" />

### Features
* Supports measurements from a single device
* Allows background color customization.
* Allows to configure realtime device measurement for model movements.
* Allows to upload custom collada(.dae, .obj, .gltf) model file.

### Installation - for the dashboards using Runtime Widget Loader
1. Download the latest `3d-model-viewer-widget-{version}.zip` file from the Releases section.
2. Make sure you have Runtime Widget Loader installed on your Cockpit or App Builder app.
3. Open a dashboard.
4. Click `more...`.
5. Select `Install Widget` and follow the instructions.

### Configuration - to view the 3d collada model in the widget
1. Make sure you have successfully installed or deployed the widget.
2. Click on `Add widget`.
3. Choose `3d model viewer` widget.
4. `Title` is the title of widget. Provide a relevant name. You may choose to hide this. Go to `Appearance` tab and choose `Hidden` under `Widget header style`.
5. Select the `device`.
6. `Model file(*.dae, *.obj, *.gltf)` is to upload the model file (*.dae, *.obj, *.gltf) into inventory binary. Please wait for it to finish the upload.
7. `Variables` is to declare variables with a constant value or map them to the realtime device measurement series. Choose Target as None and provide the constant value or choose Target as Device and then select a measurment series.
8. `Properties` is to define values for the model properties. You can provide a value as an mathematical expression using the variables defined earlier.
9. `Background color (in hex)` allows you to set a custom background color using the color picker.
10. `Show grid` allows you to show or hide the grid.
11. Click `Save` to add the widget on the dashboard.
12. In case you see unexpected results on the widget, refer to browser console to see if there are error logs.

### Development - to do the enhancements and testing locally
1. Clone the repository on local machine using `git clone https://github.com/SoftwareAG/cumulocity-3d-model-viewer-widget.git`.
2. Run `npm install` to download the module dependencies.
3. Install c8ycli `npm install -g @c8y/cli` if not already.
4. Run `c8ycli server -u https://your_tenant_url` to start the server.
5. Go to `http://localhost:9000/apps/cockpit/` in the browser to view and test your changes.
6. (Optional) push the changes back to this repository.

### Build - to create a new build for the Runtime Widget Loader
1. Finish the development and testing on your local machine.
2. Run `gulp` to start the build process. Run `npm install -g gulp` to install gulp if not already.
3. Use `widget.zip` file in the `dist` folder as a distribution.

------------------------------

These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

------------------------------

For more information you can Ask a Question in the [TECHcommunity Forums](http://tech.forums.softwareag.com/techjforum/forums/list.page?product=cumulocity).
  
  
You can find additional information in the [Software AG TECHcommunity](http://techcommunity.softwareag.com/home/-/product/name/cumulocity).