module.exports = () => {
    const $ = Ti.UI.createView({
        backgroundColor : '#44000000',
        zIndex : 999
    });
    $.add(require("ti.animation").createAnimationView({
        file : '/gears.json',
        loop : true,
        autoStart : true,
        transform : Ti.UI.create2DMatrix({
            scale : 3.0
        })
    }));
    return $;
}; 