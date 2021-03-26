const { resolve } = require('path')

module.exports = {
    base: '',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                info_aldous: resolve(__dirname, 'info_aldous.html'),
                info_fusion: resolve(__dirname, 'info_fusion.html'),
                info_prim: resolve(__dirname, 'info_prim.html'),
                info_random: resolve(__dirname, 'info_random.html')
            },
        }
    }
}
