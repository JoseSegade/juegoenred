var game = new Phaser.Game(800, 900, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render});

function preload() {
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemy_bullet', 'assets/enemy-bullet.png');
    game.load.spritesheet('invader', 'assets/invader32x32x4.png', 32, 32);
    game.load.spritesheet('enemy', 'assets/NuevosContrarios32x32.png', 32, 32);
    game.load.image('player_ship', 'assets/player32x32.png');
    game.load.image('enemy_ship', 'assets/player2_32x32.png');
    game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('background', 'assets/background2.png');
    game.load.spritesheet('plane', 'assets/volador432x32.png', 32, 32);
    game.load.spritesheet('deathplane', 'assets/DeadPlane.png', 32, 32);
    game.load.spritesheet('power','assets/powerup.png',32,32);
}

//Definimos los jugadores del juego (2)
var player;
var player2;
//Cursores para ambos jugadores
var cursors;
var cursors2 = [];
//Boton de disparo de los jugadores
var fireButton;
var fireButton2;
//Vidas de los personajes
var lives;
var lives2;
//Enemigos
var aliens;
var new_enemies;
//Avión de recompensa
var plane;
var deathplane = false;
var isplane = true;
// power up que suelta el avión
var power;
//Balas de cada personaje
var bullets;
var bullets2;

var bulletTime1 = 0;
var bulletTime2 = 0;
var explosions;
var starfield;

// Puntuacion jugador1
var score_player1 = 0;
var scoreString_player1 = '';
var scoreText_player1;

// Puntuacion jugador2
var score_player2 = 0;
var scoreString_player2 = '';
var scoreText_player2;

var planeTimer = 0;
var firingTimer = 0;
var waitTimer = 0;
var stateText;
var livingEnemies = [];
var enemyBullets;

//Nos sirven para verificar que que han sido tocados por los contrarios
var deathplayer = false;
var deathplayer2 = false;

function create(){
    // Creación de la física del juego tipo arcade
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Creación del fondo estrellado
    starfield = game.add.tileSprite(0, 0, 800, 900, 'starfield');

    // Balas del jugador uno
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // Balas del jugador dos
    bullets2 = game.add.group();
    bullets2.enableBody = true;
    bullets2.physicsBodyType = Phaser.Physics.ARCADE;
    bullets2.createMultiple(30, 'bullet');
    bullets2.setAll('anchor.x', 0.5);
    bullets2.setAll('anchor.y', 1);
    bullets2.setAll('outOfBoundsKill', true);
    bullets2.setAll('checkWorldBounds', true);

    // Balas de los invaders enemigos
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemy_bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    // El jugador 1
    player = game.add.sprite(400, game.world.height - 50, 'player_ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    // El jugador 2
    player2 = game.add.sprite(400,50, 'enemy_ship');
    player2.anchor.setTo(0.5, 0.5);
    game.physics.enable(player2, Phaser.Physics.ARCADE);
    player2.angle = 180;

    // Los enemigos
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    // Los enemigos nuevos
    new_enemies = game.add.group();
    new_enemies.enableBody = true;
    new_enemies.physicsBodyType = Phaser.Physics.ARCADE;

    // Avión de recompensa
    plane = game.add.group();
    plane.enableBody = true;
    plane.physicsBodyType = Phaser.Physics.ARCADE;

    //Power Up
    power = game.add.sprite(-50, -50, 'power');
    power.anchor.setTo(0.5, 0.5);
    game.physics.enable(power, Phaser.Physics.ARCADE);

    // Creamos los enemigos dentro de los grupos
    createAliens();
    createPlane();

    // La puntuación del jugador1
    scoreString_player1 = 'Score Player 1: ';
    scoreText_player1 = game.add.text(10, game.world.height - 44, scoreString_player1 + score_player1, {font: '34px Arial', fill: '#fff'});

    // La puntuacion del jugador2
    scoreString_player2 = 'Score Player 2: ';
    scoreText_player2 = game.add.text(10, 10, scoreString_player2 + score_player2, {font: '34px Arial', fill: '#fff'});

    // Vidas
    lives = game.add.group();
    game.add.text(game.world.width - 200, game.world.height - 100, 'Player lives: ', { font: '34px Arial', fill: '#00f' });
    lives2 = game.add.group();
    game.add.text(game.world.width - 200, 10, 'Enemy lives: ', { font: '34px Arial', fill: '#f00' });

    //  Texto del estado del juego
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var player_ship = lives.create(game.world.width - 100 + (30 * i), game.world.height - 40, 'player_ship');
        player_ship.anchor.setTo(0.5, 0.5);
        player_ship.angle = 90;
        player_ship.alpha = 0.7;
        var enemy_ship = lives2.create(game.world.width - 100 + (30 * i), 70, 'enemy_ship');
        enemy_ship.anchor.setTo(0.5, 0.5);
        enemy_ship.angle = 90;
        enemy_ship.alpha = 0.7;
    }

    // Añadimos las explosiones
    explosions = game.add.group();
    explosions.createMultiple(30, 'explosion');
    explosions.forEach(setupInvader, this);

    // Habilitamos los controles de las naves
    cursors = game.input.keyboard.createCursorKeys();

    // Asignamos al Jugador1 el botón de disparo 0 y al jugador2 el botón de disparo SPACEBAR
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //Cursores del jugador2 para la practica 2
    cursors2 [0] = game.input.keyboard.addKey(Phaser.Keyboard.A);
    cursors2 [1] = game.input.keyboard.addKey(Phaser.Keyboard.D);

    fireButton2 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);

    // Asignamos un tiempo de espera para empezar la partida
    firingTimer = game.time.now + 1000;

    //Tiempo de espera de la avioneta
    planeTimer = game.time.now + 1500;
}

function update() {
    // Movimiento del escenario de fondo
    starfield.tilePosition.y += 2;

    movePlane();

    if(player.alive && player2.alive) {
        // Reseteamos la posicion del jugador1, despues comprobamos las teclas de movimiento
        player.body.velocity.setTo(0, 0);
        
        updatePlayer1();
        updatePlayer2Bis();

       /* var currentTime = game.time.now;
        if(currentTime > firingTimer && currentTime > waitTimer) {
            enemyFires();
        }*/

        // Detectamos las colisiones
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        // Detectamos las colisiones con los enemigos amarillos
        game.physics.arcade.overlap(bullets, new_enemies, collisionHandler, null, this);
        // Detectamos las colisiones de los enemigos con el jugador1
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
        // Detectamos las balas del jugador2 con el jugador1
        game.physics.arcade.overlap(bullets2, player, enemyHitsPlayer, null, this);

        // Detectamos las colisiones
        game.physics.arcade.overlap(bullets2, aliens, collisionHandler, null, this);
        // Detectamos las colisiones con los enemigos amarillos
        game.physics.arcade.overlap(bullets2, new_enemies, collisionHandler, null, this);
        // Detectamos las colisiones de los enemigos con el jugador2
        game.physics.arcade.overlap(enemyBullets, player2, enemyHitsPlayer, null, this);
        // Detectamos las balas del jugador1 con el jugador2
        game.physics.arcade.overlap(bullets, player2, enemyHitsPlayer, null, this);

        // Detectamos las colisiones entre enemigos y jugador
        game.physics.arcade.overlap(aliens, player, enemyReachPlayer, null, this);
        // Detectamos las colisiones entre enemigos y jugador2
        game.physics.arcade.overlap(new_enemies, player2, enemyReachPlayer, null, this);
        // Detectamos las colisiones entre jugadores y avioneta
        isplane = true;
        game.physics.arcade.overlap(bullets, plane, collisionHandler, null, this);
        game.physics.arcade.overlap(bullets2, plane, collisionHandler, null, this);
        isplane = false;
        
    }
}

function render() {

}

/// This function creates the diferent types of aliens, their groups and their configurations
///
function createAliens(){
    configAliens(2, 8, 30, 'invader', 'fly_invader', [0, 1, 2, 3], aliens);
    configAliens(2, 8, 30, 'enemy', 'fly_enemy', [0, 1], aliens,'DOWN', 2, 0);    
    aliens.x = 20;
    aliens.y = game.world.height / 2 + 15;
    var tween_player1 = game.add.tween(aliens).to({x : 350}, 7500, Phaser.Easing.Quadratic.Out, true, 0, 100, true);    
    tween_player1.onRepeat.add(descend, this, 0, 'DOWN');
    
    configAliens(2, 8, 30, 'invader', 'fly_invader', [0, 1, 2, 3], new_enemies, 'UP');
    configAliens(2, 8, 30, 'enemy', 'fly_enemy', [0, 1], new_enemies, 'UP', 2, 0); 
    new_enemies.x = 350;
    new_enemies.y = game.world.height / 2 - 15;
    var tween_player2 = game.add.tween(new_enemies).to({x : 20}, 7500, Phaser.Easing.Quadratic.Out, true, 0, 100, true);    
    tween_player2.onRepeat.add(descend, this, 0, 'UP'); 
}

/// This function creates the aliens
// lines: Number of lines
// rows: Number of rows
// x_between: distance between aliens in the same line in pixels
// sprite_name: the sprite's name to be created
// animation_name: the name that the animation will get
// tiles_array: array with the tiles index in the animation
// group: group to add the aliens
///
function configAliens(lines, rows, x_between, sprite_name, animation_name, tiles_array, group, direction = 'DOWN', line_shift = 0, row_shift = 0) {
    var directions = {
        'UP': 180,
        'DOWN': 0
    }

    group.x = 0;
    group.y = 0; 
    for(var y = line_shift; y < lines + line_shift; y++){
        for(var x = row_shift; x < rows + row_shift; x++){
            var alien = group.create(x * 48, y * 32, sprite_name);

            alien.angle = directions[direction];
            if(direction == 'UP'){
                alien.x = group.x + x * 48 + (x_between * x);
                alien.y = group.y - (32 + y * 48);
            }
            else if(direction == 'DOWN') {
                alien.x = group.x + x * 48 + (x_between * x);
                alien.y = group.y + (32 + y * 48);
            }           

            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add(animation_name, tiles_array, 20, true);
            alien.play(animation_name);
            // ¿El default no es true?
            alien.body.moves = false;            
        }
    }    
}

function createPlane(){
    plane.x = 0;
    plane.y = 0;

    var avioneta = plane.create(-50, 0, 'plane');
    avioneta.anchor.setTo(0.5, 0.5);
    avioneta.animations.add('fly_plane', [0,1], 20, true);
    avioneta.animations.add('death_plane', [2], 20, true);
    avioneta.play('fly_plane');
    // ¿El default no es true?
    avioneta.body.moves = true; 
    avioneta.scale.setTo(1.5,1.5);
    //avioneta.body.velocity.x = 100;
    plane.x = -50;
    plane.y = game.world.height / 2;

    //var tween_plane = game.add.tween(plane).to({x : 350}, 7500, Phaser.Easing.Quadratic.Out, true, 0, 100, true);  
}

function movePlane(){

    plane.forEach(function(avion){
        
        var currentTime = game.time.now;
        if(currentTime > planeTimer && avion.body.x <= game.world.width + 50 && !deathplane){
            avion.body.velocity.x = 100;
        }
        else if(avion.body.x > game.world.width + 50 && !deathplane){
            avion.body.x = -50;
            avion.body.velocity.x = 0;
            planeTimer = game.time.now + 3000;
        }
        else if(deathplane){
            avion.body.x = -50;
            avion.body.velocity.x = 0;
            planeTimer = game.time.now + 3000;
            deathplane = false;
        }
        
    });
    
}

function powerUp(direction, avion){
    var dir = {
        'UP': -1,
        'DOWN': 1
    }
    power.body.y = avion.body.y;
    power.body.x = avion.body.x;
    power.body.velocity.y = 100 * dir[direction];
}



/// This function makes the aliens descend
// group: group to be aplied
// tween: not used
// direction: in which direction the aliens will move
///
function descend(group, tween, direction) {
    var dir = {
        'UP': -1,
        'DOWN': 1
    }
    group.y += 10 * dir[direction];
}

/// This function creates the aliens animation to make their explosions
// invader: the alien who will have the explosion
///
function setupInvader(invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('explosion');
}

/// This function creates a new bullet and shoots it, grabbing it from the bullets pool
// player: the player who shoot
// direction: UP, DOWN
///
function fireBullet(player, direction) {
    var directions = {
        'UP': bullets,
        'DOWN': bullets2
    }

    if (game.time.now > bulletTime1 && direction == 'UP')
    {
        // Cogemos la primera bala de la piscina
        if(direction in directions) {
            bullet = directions[direction].getFirstExists(false);
        }

        if (bullet)
        {
            //  Disparamos la bala
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -800;
            bulletTime1 = game.time.now + 1000;
        }        
    }
    else if(game.time.now > bulletTime2 && direction == 'DOWN') {
        // Cogemos la primera bala de la piscina
        if(direction in directions) {
            bullet = directions[direction].getFirstExists(false);
        }

        if (bullet) {
            //  Disparamos la bala
            bullet.angle = 180;
            bullet.reset(player.x, player.y +30);
            bullet.body.velocity.y = 800;
            bulletTime2 = game.time.now + 1000;
        }
    }

    return player;
}

/// This function makes random bullets shooted by the aliens that are alive
///
function enemyFires() {
    if(enemyBullets.lefbungth == 0) {
        enemyBullets.createMultiple(30, 'enemy_bullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);
    }
    // Cogemos la primera bala de la piscina de las balas enemigas
    var enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length = 0;

    aliens.forEachAlive(function(alien){
        // Colocamos cada enemigo vivo en un array
        livingEnemies.push(alien);
    });

    if(enemyBullet && livingEnemies.length > 0) {
        var random = game.rnd.integerInRange(0, livingEnemies.length - 1);

        // Seleccionamos un alien aleatoriamente
        var shooter = livingEnemies[random];
        // Disparamos una bala
        enemyBullet.reset(shooter.body.x, shooter.body.y);
        game.physics.arcade.moveToObject(enemyBullet,player,300);
        firingTimer = game.time.now + 500;
    }
}

/// This function manages the collision between a players bullet and an alien
// Bullet: the bullet game object
// Alien: the alien game object
///
function collisionHandler(bullet, alien) {
    // Si la bala la dispara el jugador1
    if(bullet.body.velocity.y < 0 && !isplane) {  
        // Aumentamos la puntuacion o la disminuimos segun si el alien es enemigo o aliado
        if(alien.angle != 0){
            score_player1 -= 50;
            scoreText_player1.text = scoreString_player1 + score_player1;
        }
        else {
            score_player1 += 10;
            scoreText_player1.text = scoreString_player1 + score_player1;
        }

        // Cuando una bala alcanza a un alien eliminamos a ambos de la pantalla
        bullet.kill();
        alien.kill();
    
        // Creamos la explosion
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('explosion', 30, false, true);
    
        if(aliens.countLiving() == 0) {
            score_player1 += 1000;
            scoreText_player1.text = scoreString_player1 + score_player1;
            calculateWinner();
        }
        else if(new_enemies.countLiving() == 0){
            score_player2 += 1000;
            scoreText_player2.text = scoreString_player2 + score_player2;
            calculateWinner();            
        }
        
    }
    else if(!isplane){
        // Aumentamos la puntuacion o la disminuimos segun si el alien es enemigo o aliado
        if(alien.angle == 0){
            score_player2 -= 50;
            scoreText_player2.text = scoreString_player2 + score_player2;                       
        }
        else {
            score_player2 += 10;
            scoreText_player2.text = scoreString_player2 + score_player2;
        }

        // Cuando una bala alcanza a un alien eliminamos a ambos de la pantalla
        bullet.kill();
        alien.kill();
    
        // Creamos la explosion
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('explosion', 30, false, true);
    
        if(new_enemies.countLiving() == 0) {
            score_player2 += 1000;
            scoreText_player2.text = scoreString_player2 + score_player2;
            calculateWinner(); 
        }
        else if(aliens.countLiving() == 0) {
            score_player1 += 1000;
            scoreText_player1.text = scoreString_player1 + score_player1;
            calculateWinner();
        }
    }

    else{
        bullet.kill();

        if(bullet.body.velocity.y < 0){
            powerUp('DOWN', alien);
            deathplane = true;
            //deathplane = true;
           // movePlane();
        }
        else {
            powerUp('UP', alien);
            deathplane = true;
            //alien.play('death_plane');
            //deathplane = true;
            //movePlane();
        }

    }
}

/// This function comparates the punctuations, the player who got more, the player who win
///
function calculateWinner() {
    if(score_player1 > score_player2){
        stateText.text = 'You win, \n Click to restart';
    }
    else if (score_player2 > score_player1) {
        stateText.text = 'You lose, \n Click to restart';   
    }
    else {
        stateText.text = 'DRAW, \n Click to restart';        
    }
    enemyBullets.callAll('kill', this);
    
    stateText.visible = true;

    // La funcion para reiniciar
    game.input.onTap.addOnce(restart, this);
}

/// This function manages the collision between an enemys bullet and a player
// player: the player game object
// bullet: the bullet game object
///

//Probando cuando los enemigos llegan a la posición del jugador
function enemyReachPlayer(player, alien){

    if(player.body.y > game.world.height / 2 && deathplayer == false) {
        // Creamos la explosion
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explosion', 30, false, true);
        
            live = lives.getFirstAlive();
            
            if(live) {
                live.kill();
                //Añadimos un delay cuando nos matan de 2 segundos y eliminamos todas las balas
                enemyBullets.callAll('kill');
                waitTimer = game.time.now + 2000;
                deathplayer = true;
                relocateALL();
            }

            // Si el jugador se muere
            if(lives.countLiving() < 1) {
                player.kill();
                enemyBullets.callAll('kill');
                deathplayer = true;
                showText(deathplayer, deathplayer2);
                //stateText.text = 'YOU DIED! \n Click to restart';
               // stateText.visible = true;

            }
        
    }
    else if(deathplayer2 == false){

        // Creamos la explosion
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explosion', 30, false, true);

            live2 = lives2.getFirstAlive()
            
            if(live2) {
                live2.kill();
                //Añadimos un delay cuando nos matan de 2 segundos y eliminamos todas las balas
                enemyBullets.callAll('kill');
                waitTimer = game.time.now + 2000;
                deathplayer2 = true;
                relocateALL();
            }

            // Si el jugador se muere
            if(lives2.countLiving() < 1) {
                player2.kill();
                enemyBullets.callAll('kill');
                deathplayer = true;
                showText(deathplayer, deathplayer2);
                //stateText.text = "Your enemy died \n Click to restart";
                //stateText.visible = true;
            }      
    }
}


function showText(deathplayer = false,  deathplayer2 = false){
    if(deathplayer == true && deathplayer2 == true)
    {
        stateText.text = "Both die \n Click to restart";
        stateText.visible = true;
    }
    else if(deathplayer2 == true && deathplayer == false)
    {
        stateText.text = "Your enemy died \n Click to restart";
        stateText.visible = true;
    }
    else if(deathplayer2 == false && deathplayer == true)
    {
        stateText.text = "You DIED \n Click to restart";
        stateText.visible = true;
    }

    // La funcion para reiniciar
    game.input.onTap.addOnce(restart, this);
}

//Recolocamos todos los enemigos vivos con la función forEach
function relocateALL(){
    var x = 0;
    var y = 0;

    aliens.forEach(function(alien){

        aliens.x = 0;
        aliens.y = 0; 
        alien.x = aliens.x + x * 48 + (30 * x);
        alien.y = aliens.y + (32 + y * 48);
        x++;
        if(x>=8){
            y++;
            x = 0;
        }
             
    });

    aliens.x = 20;
    aliens.y = game.world.height / 2 + 15;

    x = 0;
    y = 0;

    new_enemies.forEach(function(enemies){
      
        new_enemies.x = 0;
        new_enemies.y = 0; 
        enemies.x = new_enemies.x + x * 48 + (30 * x);
        enemies.y = new_enemies.y - (32 + y * 48);
        x++;
        if(x>=8){
            y++;
            x = 0;
        }
    });

    plane.forEach(function(avion){
        avion.body.x = -50;
        planeTimer = game.time.now + 2000;
    })


   new_enemies.x = 20;
   new_enemies.y = game.world.height / 2 - 15;

    deathplayer = false;
    deathplayer2 = false;
}

function enemyHitsPlayer(player, bullet) {
    bullet.kill();

    // Creamos la explosion
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('explosion', 30, false, true);

    if(player.body.y > game.world.height / 2) {
        live = lives.getFirstAlive();
        
        if(live) {
            live.kill();
            //Añadimos un delay cuando nos matan de 2 segundos y eliminamos todas las balas
            enemyBullets.callAll('kill');
            waitTimer = game.time.now + 2000;

        }

        // Si el jugador se muere
        if(lives.countLiving() < 1) {
            player.kill();
            enemyBullets.callAll('kill');

            stateText.text = 'YOU DIED! \n Click to restart';
            stateText.visible = true;

            // La funcion para reiniciar
            game.input.onTap.addOnce(restart, this);
        }
    }
    else {
        live2 = lives2.getFirstAlive()
        
        if(live2) {
            live2.kill();
            //Añadimos un delay cuando nos matan de 2 segundos y eliminamos todas las balas
            enemyBullets.callAll('kill');
            waitTimer = game.time.now + 2000;

        }

        // Si el jugador se muere
        if(lives2.countLiving() < 1) {
            player2.kill();
            enemyBullets.callAll('kill');

            stateText.text = "Your enemy died \n Click to restart";
            stateText.visible = true;

            // La funcion para reiniciar
            game.input.onTap.addOnce(restart, this);
        }
    }
    

    

    // Si el jugador se muere
    if(lives.countLiving() < 1) {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text = 'GAME OVER \n Click to restart';
        stateText.visible = true;

        // La funcion para reiniciar
        game.input.onTap.addOnce(restart, this);
    }
}

/// This function makes a new level and restart the game
///
function restart() {
    // Reiniciamos el numero de vidas
    lives.callAll('revive');
    lives2.callAll('revive');

    // Revivimos a los aliens
    aliens.removeAll();
    new_enemies.removeAll();
    createAliens();

    plane.removeAll();
    createPlane();

    score_player1 = 0;
    scoreText_player1.text = scoreString_player1 + score_player1;
    score_player2 = 0;
    scoreText_player2.text = scoreString_player2 + score_player2;
    
    firingTimer = game.time.now + 1000;  
    waitTimer = 0; 

    deathplayer = false;
    deathplayer2 = false;

    // Revivimos al jugador
    player.revive();
    // Ocultamos el texto
    stateText.visible = false;
}

/// This function removes the bullet. This is called if the bullet goes off the screen
///
function resetBullet() {
    bullet.kill();
}

function updatePlayer1() {
    var output = "['SKIP']";
    //  Detectamos las teclas del jugador1
    if(cursors.left.isDown) {
        if(player.body.x > 200) {
            player.body.velocity.x = -200;            
        }
        output = "['MOVE_LEFT']";
    }
    else if(cursors.right.isDown) {
        if(player.body.x < game.world.width - 200) {
            player.body.velocity.x = 200;            
        }
        output = "['MOVE_RIGHT']";
    }

    // Disparos
    if(fireButton.isDown) {
        player = fireBullet(player, 'UP');
        output += ",['SHOOT']";
    }
    output += ";";
}

/// This function will get the key from the connected computer to know what the player2 will do
///
function updatePlayer2() {
    // Reseteamos la posicion del jugador2, despues comprobamos las teclas de movimiento
    player2.body.velocity.setTo(0, 0);

    var functions_player2 = {
        'SHOOT': function() {
            player2 = fireBullet(player2, 'DOWN');
        },
        'MOVE_LEFT': function() {
            if(player2.body.x > 200) {
                player2.body.velocity.x = -200;            
            }
        },
        'MOVE_RIGHT': function() {
            if(player2.body.x < game.world.width - 200) {
                player2.body.velocity.x = 200;            
            }
        },
        'SKIP': function() {
            return 0;
        }
    }

    //  We will simulate a key
    var key = ['MOVE_LEFT', 'MOVE_RIGHT', 'SKIP', 'SHOOT'];
    var random = game.rnd.integerInRange(0, 2);
    functions_player2[key[random]]();
    random = game.rnd.integerInRange(2, 3);
    functions_player2[key[random]]();
    
}
//Función para la práctica 2 de partida uno contra uno en el mismo ordenador
function updatePlayer2Bis() {
    var output = "['SKIP']";
    //  Detectamos las teclas del jugador1
    if(cursors2[0].isDown) {
        if(player2.body.x > 200) {
            player2.body.velocity.x = -200;            
        }
        output = "['MOVE_LEFT']";
    }
    else if(cursors2[1].isDown) {
        if(player2.body.x < game.world.width - 200) {
            player2.body.velocity.x = 200;            
        }
        output = "['MOVE_RIGHT']";
    }
    else if(cursors2[0].isUp && cursors2[1].isUp){
        player2.body.velocity.x = 0;
    }

    // Disparos
    if(fireButton2.isDown) {
        player2 = fireBullet(player2, 'DOWN');
        output += ",['SHOOT']";
    }
    output += ";";
}

