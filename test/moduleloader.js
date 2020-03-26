/*! 🧮🧩 2020*/

const canuserIntersectionObserver = ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype);
const triggerModuleLoad = function(element){
    const moduleToLoad = element.dataset.module;
    element.classList.add('initiated');
    import(/* webpackChunkName: "[request]" */`./modules/${moduleToLoad}`).then(function(module){
        if (typeof module.init === 'function') {
            module.init(element);
        } else if (typeof module.default.init === 'function') {
            module.default.init(element);
        }
    }).catch(function () {
    //}).catch(function(error){
        //console.log(error);
    });
};
const io = !canuserIntersectionObserver ? false : new IntersectionObserver(function(entries) {
    entries.forEach(function(entriesRecord) {
        const element = entriesRecord.target;
        const visible = entriesRecord.intersectionRatio !== 0;
        if (visible){
            triggerModuleLoad(element);
            io.unobserve(element);
        }
    });
});
const external = function(){
    throw new Error('external?');
};
const scan = function(selector){
    const items = selector.querySelectorAll('[data-module]:not(.initiated)');
    for (const element of items){
        if (canuserIntersectionObserver && typeof element.dataset.instant === 'undefined'){
            io.observe(element);
        } else {
            triggerModuleLoad(element);
        }
    }
};
const runModuleFunction = function(string, target){
    const splitFunction = string.split('::');
    if (splitFunction.length == 2){
    import(/* webpackChunkName: "[request]" */`./${splitFunction[0]}`).then(function(module){
        if (typeof module[splitFunction[1]] === 'function'){
            module[splitFunction[1]](target);
        } else if (typeof module.default[splitFunction[1]] === 'function') {
            module.default[splitFunction[1]](target);
        }
    });
    }
};
const apModuleLoader = {
    scan,
    external,
    run: runModuleFunction,
};
export default apModuleLoader;
