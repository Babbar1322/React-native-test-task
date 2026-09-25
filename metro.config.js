const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    unstable_enablePackageExports: false,
    enablePackageExports: false,
    resolverMainFields: ["react-native", "browser", "module", "main"],
    resolveRequest: (context, moduleName, platform) => {
      // 1. Force root SDK packages to use ES Modules entry point
      if (moduleName === '@aws-sdk/client-s3') {
        return context.resolveRequest(context, '@aws-sdk/client-s3/dist-es/index.js', platform);
      }
      if (moduleName === '@aws-sdk/s3-request-presigner') {
        return context.resolveRequest(context, '@aws-sdk/s3-request-presigner/dist-es/index.js', platform);
      }

      // 2. Map runtimeConfig to native version
      if (
        moduleName.endsWith('/runtimeConfig') &&
        (context.originModulePath.includes('@aws-sdk') || context.originModulePath.includes('@smithy'))
      ) {
        return context.resolveRequest(context, moduleName + '.native', platform);
      }

      // 3. Prevent accidental bundling of Node built-ins
      if (moduleName === '@aws-sdk/credential-provider-node') {
        return { type: 'empty' };
      }
      if (moduleName.startsWith('node:') || ['stream', 'http', 'https', 'http2', 'crypto', 'os', 'path', 'fs', 'child_process'].includes(moduleName)) {
        return { type: 'empty' };
      }

      return context.resolveRequest(context, moduleName, platform);
    },
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(
      (ext) => ext !== "svg"
    ),
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, "svg"],
  },
};

module.exports = mergeConfig(
  getDefaultConfig(__dirname),
  wrapWithReanimatedMetroConfig(config)
);
