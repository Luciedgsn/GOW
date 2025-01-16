// Initialisation de la scène
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

<<<<<<< HEAD
    scene.collisionsEnabled = true;

    // Lumière
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.5;
=======
    // Lumière globale très faible pour assombrir la scène
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.05;
>>>>>>> ef30bc23b9546a01e59bdfdd0fd993bd8c858e60

    let player;
    BABYLON.SceneLoader.ImportMesh(
        null, 
        "models/", 
        "mec.gltf", 
        scene, 
        (meshes) => {
<<<<<<< HEAD
            player = meshes[0];
            player.scaling = new BABYLON.Vector3(2, 2, 2);
            player.position = new BABYLON.Vector3(0, 1.5, 0);
            player.checkCollisions = true;
            player.ellipsoid = new BABYLON.Vector3(1, 1, 1);
            player.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
            
=======
            player = meshes[0]; 
            player.scaling = new BABYLON.Vector3(2, 2, 2); 
            player.position = new BABYLON.Vector3(0, 1.5, 0); 
            player.checkCollisions = true; 

>>>>>>> ef30bc23b9546a01e59bdfdd0fd993bd8c858e60
            const playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
            playerMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); 
            playerMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); 
            playerMaterial.emissiveIntensity = 0.2; 
            player.material = playerMaterial;
        }
    );

    // Ajout d'une lumière ponctuelle pour simuler la lanterne
    const lanternLight = new BABYLON.PointLight("lanternLight", new BABYLON.Vector3(0, 1.5, 0), scene);
    lanternLight.intensity = 1; // Luminosité de la "lanterne"
    lanternLight.range = 10; // Distance maximale d'éclairage
    lanternLight.diffuse = new BABYLON.Color3(1, 0.85, 0.6); // Couleur chaleureuse

    // Associez la lumière à la position du joueur
    scene.onBeforeRenderObservable.add(() => {
        if (player) {
            lanternLight.position = player.position.clone().add(new BABYLON.Vector3(0, 1.5, 0));
        }
    });

    // Ajout d'un effet volumétrique pour une lueur douce
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 0.2; // Ajustez l'intensité pour l'effet souhaité

    // Ennemi
    const enemy = BABYLON.MeshBuilder.CreateBox("enemy", { size: 3 }, scene);
    enemy.position.set(5, 1.5, 0);
    const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
    enemyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    enemy.material = enemyMaterial;

    // Sol
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);  // Taille réduite
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMaterial;
    ground.checkCollisions = true;

// Hauteur des murs
const wallHeight = 10;  // Hauteur des murs
const wallThickness = 1;
const taillePiece = 60;  // Taille de la pièce

// Création du matériau gris pour les murs
const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
wallMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);  // Gris pour les murs

    // Mur avant
    const wallFront = BABYLON.MeshBuilder.CreateBox("wallFront", { width: 30, height: wallHeight, depth: wallThickness }, scene);  // Taille réduite
    wallFront.position = new BABYLON.Vector3(0, wallHeight / 2, 15); // Positionner à l'avant
    const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8); 
    wallFront.material = wallMaterial;
    wallFront.checkCollisions = true;

    // Mur arrière
    const wallBack = BABYLON.MeshBuilder.CreateBox("wallBack", { width: 30, height: wallHeight, depth: wallThickness }, scene);  // Taille réduite
    wallBack.position = new BABYLON.Vector3(0, wallHeight / 2, -15); // Positionner à l'arrière
    wallBack.material = wallMaterial;
    wallBack.checkCollisions = true;

    // Mur gauche
    const wallLeft = BABYLON.MeshBuilder.CreateBox("wallLeft", { width: wallThickness, height: wallHeight, depth: 30 }, scene);  // Taille réduite
    wallLeft.position = new BABYLON.Vector3(-15, wallHeight / 2, 0); // Positionner à gauche
    wallLeft.material = wallMaterial;
    wallLeft.checkCollisions = true;

    // Mur droit
    const wallRight = BABYLON.MeshBuilder.CreateBox("wallRight", { width: wallThickness, height: wallHeight, depth: 30 }, scene);  // Taille réduite
    wallRight.position = new BABYLON.Vector3(15, wallHeight / 2, 0); // Positionner à droite
    wallRight.material = wallMaterial;
    wallRight.checkCollisions = true;

    // Caméra
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 10, -20), scene);  // Ajuster la position de la caméra
    camera.rotation.x = Math.atan(10 / 20);
    camera.attachControl(canvas, false);

    // Interface utilisateur
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const clickText = new BABYLON.GUI.TextBlock();
    clickText.text = "Clics restants : 3";
    clickText.color = "white";
    clickText.fontSize = 24;
    clickText.top = "-40px";
    clickText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    clickText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(clickText);

    let clickCount = 0;

    // Fonction de gestion des clics sur l'ennemi
    const checkClickOnEnemy = (event) => {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.pickedMesh === enemy) {
            clickCount++;
            const originalColor = enemy.material.diffuseColor.clone();
            enemy.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
            setTimeout(() => {
                enemy.material.diffuseColor = originalColor;
            }, 200);

            const remainingClicks = 3 - clickCount;
            if (remainingClicks > 0) {
                clickText.text = `Clics restants : ${remainingClicks}`;
            } else if (clickCount >= 3) {
                clickText.text = "L'ennemi est éliminé !";

                const particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
                particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene);
                particleSystem.emitter = enemy.position.clone();
                particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
                particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
                particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1);
                particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 1);
                particleSystem.minSize = 0.1;
                particleSystem.maxSize = 0.3;
                particleSystem.minLifeTime = 0.2;
                particleSystem.maxLifeTime = 0.5;
                particleSystem.emitRate = 1000;
                particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
                particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
                particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
                particleSystem.start();
            
                BABYLON.Animation.CreateAndStartAnimation(
                    "scaleDown",
                    enemy,
                    "scaling",
                    30,
                    10,
                    enemy.scaling,
                    new BABYLON.Vector3(0, 0, 0),
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                    null,
                    () => {
                        particleSystem.stop();
                        enemy.dispose();
                    }
                );
            }
            
        }
    };
    

    canvas.addEventListener("click", checkClickOnEnemy);

    // Gestion des événements clavier et déplacement du joueur
    const keyboardMap = {};
    const speed = 0.1;
    const jumpSpeed = 0.2;
    const jumpHeightMax = 2;
    let isJumping = false;
    let jumpHeight = 0;

    scene.onBeforeRenderObservable.add(() => {
        const moveVector = new BABYLON.Vector3(0, 0, 0);

        if (keyboardMap["ArrowUp"] || keyboardMap["z"]) moveVector.z = 1;
        if (keyboardMap["ArrowDown"] || keyboardMap["s"]) moveVector.z = -1;
        if (keyboardMap["ArrowLeft"] || keyboardMap["q"]) moveVector.x = -1;
        if (keyboardMap["ArrowRight"] || keyboardMap["d"]) moveVector.x = 1;

        const nextPosition = player.position.add(moveVector.scale(speed));

        // Détection de collision avec les murs
        if (nextPosition.x > -15 && nextPosition.x < 15 && nextPosition.z > -15 && nextPosition.z < 15) {
            player.position.addInPlace(moveVector.scale(speed)); // Appliquer le mouvement si pas de collision avec les murs
        }

            if (keyboardMap[" "]) {
                if (!isJumping && player.position.y <= 1.5) {
                    isJumping = true;
                    jumpHeight = 0;
                }
            }

            if (isJumping) {
                player.position.y += jumpSpeed;
                jumpHeight += jumpSpeed;
                if (jumpHeight >= jumpHeightMax) isJumping = false;
            } else if (player.position.y > 1.5) {
                player.position.y -= jumpSpeed;
            } else {
                player.position.y = 1.5;
            }
        }

        const deltaX = player.position.x - camera.position.x;
        if (Math.abs(deltaX) > thresholdX) {
            camera.position.x += (deltaX > 0 ? 1 : -1) * (Math.abs(deltaX) - thresholdX);
        }

        camera.position.y = 10;
        camera.position.z = -20;
    });

    // Gestion des événements clavier
    window.addEventListener("keydown", (evt) => {
        keyboardMap[evt.key] = true;
    });
    window.addEventListener("keyup", (evt) => {
        keyboardMap[evt.key] = false;
    });

    return scene;
};

const scene = createScene();
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // Fond noir

// Boucle de rendu
engine.runRenderLoop(() => scene.render());

// Ajustement de la taille du canvas lors du redimensionnement de la fenêtre
window.addEventListener("resize", () => engine.resize());
