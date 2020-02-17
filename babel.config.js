module.exports = {
  presets: [
    ['@vue/app', { useBuiltIns: 'entry' }]
  ],
  plugins: [
    ['transform-object-rest-spread', { useBuiltIns: true }]
  ]
};
