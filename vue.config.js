module.exports = {
    configureWebpack: {
        devServer: {
            proxy: { // 使用代理
                '/musichall': {
                    target: 'https://c.y.qq.com',
                    changeOrigin: true
                },
                '/splcloud': {
                    target: 'https://c.y.qq.com',
                    changeOrigin: true,
                    headers: { // 绕过 referer 的限制
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    }
                },
                '/v8': {
                    target: 'https://c.y.qq.com',
                    changeOrigin: true,
                    headers: { // 绕过 referer 的限制
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    }
                },
                '/cgi-bin': { // 代理播放源
                    target: 'https://u.y.qq.com',
                    changeOrigin: true,
                    headers: { // 绕过 referer 的限制
                        referer: 'https://u.y.qq.com/',
                        host: 'u.y.qq.com'
                    }
                },
                '/soso': { // 代理搜索
                    target: 'https://c.y.qq.com',
                    changeOrigin: true,
                    headers: { // 绕过 referer 的限制
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    }
                },
                '/qzone': { // 代理搜索
                    target: 'https://c.y.qq.com',
                    changeOrigin: true,
                    headers: { // 绕过 referer 的限制
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    }
                }
            }
        }
    }
}