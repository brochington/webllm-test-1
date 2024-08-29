import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';

export default defineConfig({
  plugins: [pluginBasicSsl(), pluginReact(), pluginNodePolyfill()],
});
