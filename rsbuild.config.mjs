import { defineConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Twake Photos',
  hasServices: true,
  hasPublic: true
})

export default defineConfig(config)
