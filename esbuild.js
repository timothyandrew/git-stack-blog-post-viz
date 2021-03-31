require('esbuild').build({
  entryPoints: ['index.js'],
  bundle: true,
  minify: true,
  watch: true,
  outfile: "/home/tim/kb/static/js/git-stack.js",
  define: {
    'process.env.NODE_ENV': '"production"'
  },
}).catch(() => process.exit(1))