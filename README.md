# Cumulocity Advanced Radial Gauge Widget Plugin

This Advanced Radial Gauge widget is the Cumulocity module federation plugin. This plugin can be used in Application Builder or Cockpit. It shows the latest realtime measurement on a radial gauge.

### Please note that this plugin is in currently under BETA mode.

### Please choose Advanced Radial Gauge Widget release based on Cumulocity/Application builder version:

|APPLICATION BUILDER | CUMULOCITY | ADVANCED RADIAL GAUGE WIDGET PLUGIN  |
|--------------------|------------|--------------------------------------|
| 1.4.x(coming soon) | >= 1015.x.x| 1.x.x                                |

## Prerequisites:
   1. This Plugin is exclusive to Application Builder.
   2. Cumulocity c8ycli >=1014.x.x
   
## Installation

### Configuration - to add the plugin on dashboard
1. Make sure you have successfully installed the plugin.
2. Click on `Add widget`.
3. Choose `Advanced Radial Gauge` widget.
4. `Title` is the title of widget. Provide a relevant name. You may choose to hide this. Go to `Appearance` tab and choose `Hidden` under `Widget header style`.
5. Select the `device`.
6. `Measurement name` is the measurement supported by the selected device. Latest value of this measurement will be shown.
7. `Measurement font size` is to define the font size of the measurment value.
8. `No. of digits after decimal` is to define the number of digits to be shown after decimal point in measurment value.
9. `Indicator type` is how you want to indicate the current value on the chart. It can be `Pointer` or `Progress Bar`.
10. `Axis width` is the width of axis.
11. `Axis label distance` is the distance of labels from the axis.
12. `Pointer offset (in %)` is the distance of pointer from the center of the chart. This is only applicable when `Indicator type` is `Pointer`.
13. `Progress bar color` is the color of progress bar. This is only application when `Indicator type` is `Progress bar`.
14. `Text` is Label Text. It's a free text field that can be used to name the measurement or radial guage.
15. `Font size` is Label font size. It is to set the Label font size.
15. `Hyperlink` is to provide a url where you would like to navigate on click of the label. It is optional.
15. `Starting value` is the minimum measurement value expected.
16. `Limit value` is the maximum measurement value expected in case of single range. It will be limit value of a range in case of multiple ranges.
17. `Color` is range color. It is to set color of the defined range on axis.
18. `Add range` is to define additional ranges. Make sure the limit value of a next range is higher than its previous one.
19. `Remove range` is to delete a particular range.
20. Click `Save` to add the widget on the dashboard.
21. In case you see unexpected results on the widget, refer to browser console to see if there are error logs.

### Runtime Deployment?

* This widget support runtime deployment. Download [Runtime Binary](https://github.com/SoftwareAG/cumulocity-advanced-radial-gauge-widget-plugin/releases/download/1.0.0-beta/advanced-radial-gauge-1.0.0-beta.zip) and install via Administrations(Beta mode) --> Ecosystems --> Applications --> Packages 

### Local Development?

**Requirements:**
* Git
* NodeJS (release builds are currently built with `v14.18.0`)
* NPM (Included with NodeJS)

**Instructions**
1. Clone the repository: 
```
git clone https://github.com/SoftwareAG/cumulocity-advanced-radial-gauge-widget-plugin.git
```
2. Change directory: 
```
cd cumulocity-advanced-radial-gauge-widget-plugin
```
3. Install the dependencies: 
```
npm install
```
4. (Optional) Local development server: 
```
npm start -- --shell cockpit
```
5. Build the app: 
```
npm run build
```
6. Deploy the app: 
```
npm run deploy
```


------------------------------

These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.
_____________________
For more information you can Ask a Question in the [TECH Community Forums](https://tech.forums.softwareag.com/tag/Cumulocity-IoT).
