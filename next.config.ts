import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * pino, pino-pretty and thread-stream are here to fix this issue:
   * https://github.com/vercel/next.js/issues/86099#issuecomment-3610573089
   *
   * when this problem fixed, we can remove these packages from the serverExternalPackages and from package.json
   */
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
  
  webpack: (config, { webpack }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding", "porto", "porto/internal");
    
    // Fallback for node modules and React Native dependencies
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      '@react-native-async-storage/async-storage': false,
    };

    // Ignore test files in node_modules
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(test|spec)\.[jt]sx?$/,
        contextRegExp: /node_modules/,
      })
    );
    
    return config;
  },

  transpilePackages: ['@wagmi/connectors', '@reown/appkit-adapter-wagmi'],
  
  
};

export default nextConfig;
// transpilePackages: ['@wagmi/connectors', '@reown/appkit-adapter-wagmi'],