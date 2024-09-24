import type { ConfigurationOptions } from '@c8y/devkit';
import { author, description, version, name } from './package.json';

export default {
  runTime: {
    author,
    description,
    version,
    name,
    contentSecurityPolicy:
      "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
    dynamicOptionsUrl: true,
    remotes: {
      // 'plugin name from package.json': [ PluginModule ]
      'c8y-advanced-radial-gauge-widget-plugin': ['AdvancedRadialGaugeModule'],
    },
    package: 'plugin',
    isPackage: true,
    noAppSwitcher: true,
    exports: [
      {
        name: 'Advanced Radial Gauge',
        module: 'AdvancedRadialGaugeModule',
        path: './src/app/advanced-radial-gauge/advanced-radial-gauge.module.ts',
        description:
          'Cumulocity Advanced Radial Gauge Widget shows the latest realtime measurement on a radial gauge.',
      },
    ],
  },
  buildTime: {
    federation: [
      '@angular/animations',
      '@angular/cdk',
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      '@angular/upgrade',
      '@c8y/client',
      '@c8y/ngx-components',
      'ngx-bootstrap',
      '@ngx-translate/core',
      '@ngx-formly/core',
    ],
  },
} as const satisfies ConfigurationOptions;
