window.addEventListener('DOMContentLoaded', function() {

    var canvas = this.document.getElementById('Canvas'); // Assurez-vous que l'ID est correct

    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera('camera', BABYLON.Tools.ToRadians(180), BABYLON.Tools.ToRadians(160), 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var box = BABYLON.Mesh.CreateBox('boite', 2.0, scene);
        return scene;
    }

    var scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });
});
