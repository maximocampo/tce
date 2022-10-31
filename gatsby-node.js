exports.onCreateWebpackConfig = ({
    stage,
    actions,
    getConfig
}) => {
    if (stage === 'build-html' || stage === "develop-html") {
        actions.setWebpackConfig({
            externals: getConfig().externals.concat(function(context, request, callback) {
                const regex = /^@?firebase(\/(.+))?/;
                if (regex.test(request)) {
                    return callback(null, 'umd ' + request);
                }
                callback();
            })
        });
    }
};

exports.onCreatePage = ({page, actions}) => {
    const nm = page.componentPath.split('/')[page.componentPath.split('/').length - 1]
    
    if (!nm.includes('.page.js')) {
        return actions.deletePage(page)
    }
    
    return actions.createPage({
        ...page,
        path: nm.includes('index') ? '/' : nm.replace('.page.js', '')
    })
}
