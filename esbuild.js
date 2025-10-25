import { build } from 'esbuild';

build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  target: ['node24'],
  outfile: 'dist/server.js',
  sourcemap: false,
  minify: true,
  external: ['stripe', 'winston', 'nodemailer', 'swagger-ui-express'],
}).catch(() => process.exit(1));
