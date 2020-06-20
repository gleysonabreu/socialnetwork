module.exports = {
  presets: [
    [
      'airbnb',
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@database': './src/database',
        '@controllers': './src/controllers'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
