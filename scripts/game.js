// Initialisation de la scène
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Lumière
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    let player;
    BABYLON.SceneLoader.ImportMesh(
        null, 
        "models/", // Chemin vers le dossier contenant le fichier gltf
        "mec.gltf", // Nom du fichier gltf
        scene, 
        (meshes) => {
            player = meshes[0]; // On utilise le premier mesh du modèle importé
            player.position = new BABYLON.Vector3(0, 0, 0); // Position initiale
            player.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // Ajuste l'échelle du modèle si nécessaire
        }
    );

    // Ennemi (Cube) avec une couleur rouge
    const enemy = BABYLON.MeshBuilder.CreateBox("enemy", { size: 1 }, scene);
    enemy.position.set(5, 0.5, 0);
    const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
    enemyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Rouge
    enemy.material = enemyMaterial;

    // Création du sol avec texture blanche
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // Couleur blanche
    ground.material = groundMaterial;

    // Caméra
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 10, -15), scene);
    camera.rotation.x = Math.atan(10 / 15); // Inclinaison pour viser le terrain
    camera.attachControl(canvas, false); // Désactiver les contrôles manuels

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

    let clickCount = 0; // Compteur de clics sur l'ennemi

    // Variables pour le déplacement
    const speed = 0.1; // Vitesse de déplacement
    const jumpSpeed = 0.2; // Vitesse du saut
    const jumpHeightMax = 2; // Hauteur maximale du saut
    let isJumping = false; // Indicateur pour vérifier si le joueur est en train de sauter
    let jumpHeight = 0; // Hauteur actuelle du saut
    const keyboardMap = {}; // Dictionnaire pour les touches du clavier

    const thresholdX = 4; // Zone tampon pour déplacer la caméra horizontalement

 

    // Fonction de gestion des clics sur l'ennemi
    const checkClickOnEnemy = (event) => {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY); // Détection de la position du clic
        if (pickResult.pickedMesh === enemy) {
            clickCount++;
            console.log(`Clic détecté sur l'ennemi. Compteur: ${clickCount}`);

            // **Changement de couleur temporaire**
            const originalColor = enemy.material.diffuseColor.clone();
            enemy.material.diffuseColor = new BABYLON.Color3(1, 1, 0); // Jaune temporaire
            setTimeout(() => {
                enemy.material.diffuseColor = originalColor;
            }, 200); // Revenir à la couleur rouge après 200ms

            // Mise à jour du texte
            const remainingClicks = 3 - clickCount;
            if (remainingClicks > 0) {
                clickText.text = `Clics restants : ${remainingClicks}`;
            }

            // Si le compteur de clics atteint 3, tuer l'ennemi
            if (clickCount >= 3) {
                console.log("L'ennemi est tué !");
                clickText.text = "L'ennemi est éliminé !";

                // Effet de désintégration (particules)
                const particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
                particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene);
                particleSystem.emitter = enemy.position.clone(); // Lancer les particules depuis l'ennemi
                particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
                particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
                particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1); // Couleur rouge
                particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 1); // Couleur jaune
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

                // Faire disparaître le cube avec une animation
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
                        enemy.dispose(); // Supprimer l'ennemi
                    }
                );
            }
        }
    };

    // Écouteur d'événements pour les clics
    canvas.addEventListener("click", checkClickOnEnemy);

    scene.onBeforeRenderObservable.add(() => {
        // Réinitialiser le vecteur de mouvement
        const moveVector = new BABYLON.Vector3(0, 0, 0);

        if (keyboardMap["ArrowUp"] || keyboardMap["w"]) moveVector.z = 1;
        if (keyboardMap["ArrowDown"] || keyboardMap["s"]) moveVector.z = -1;
        if (keyboardMap["ArrowLeft"] || keyboardMap["a"]) moveVector.x = -1;
        if (keyboardMap["ArrowRight"] || keyboardMap["d"]) moveVector.x = 1;

        // Calculer la prochaine position du joueur
        const nextPosition = player.position.add(moveVector.scale(speed));

        // Détection de collision avec l'ennemi
        const distanceToEnemy = BABYLON.Vector3.Distance(nextPosition, enemy.position);
        if (distanceToEnemy > 1.1) { // Si le joueur est suffisamment loin de l'ennemi
            player.position.addInPlace(moveVector.scale(speed)); // Appliquer le mouvement
        }

        // Gestion du saut (avec la barre espace)
        if (keyboardMap[" "]) {
            if (!isJumping && player.position.y <= 0.5) {
                
           
                isJumping = true;
                jumpHeight = 0;

            }
        }

        if (isJumping) {
            player.position.y += jumpSpeed;
            jumpHeight += jumpSpeed;

            if (jumpHeight >= jumpHeightMax) {
                isJumping = false;
            }
        } else {
            if (player.position.y > 0.5) {
                player.position.y -= jumpSpeed;
            } else {
                player.position.y = 0.5;
            }
        }

        const deltaX = player.position.x - camera.position.x;
        if (Math.abs(deltaX) > thresholdX) {
            camera.position.x += (deltaX > 0 ? 1 : -1) * (Math.abs(deltaX) - thresholdX);
        }

        camera.position.y = 10;
        camera.position.z = -15;
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

// Boucle de rendu
engine.runRenderLoop(() => {
    scene.render();
});

// Ajustement
window.addEventListener("resize", () => {
    engine.resize();
});
