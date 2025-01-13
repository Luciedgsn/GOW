window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas'); 
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera('camera', BABYLON.Tools.ToRadians(180), BABYLON.Tools.ToRadians(160), 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var box = BABYLON.Mesh.CreateBox('boite', 2.0, scene);
        return scene;
    };

    var scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
