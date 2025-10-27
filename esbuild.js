import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  target: ['node24'],
  outfile: 'dist/server.js',
  sourcemap: false,
  minify: true,
  plugins: [nodeExternalsPlugin()],
  external: [
    'stripe',
    'winston',
    'nodemailer',
    '@prisma/client',
    './prisma/client',
  ],
}).catch(() => process.exit(1));
