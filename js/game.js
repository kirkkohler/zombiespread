'use strict';

var game = new Phaser.Game(2500, 2500, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});

/*
 * Variables
 */

/*
 * preload vars
 */

/*
 * create vars
 */

// player Properties
var player;
var fixed;
var camera;
var cursors;

// NPC Properties
//  The non-player-character group contains all the npcs that a player can turn into a zombie
var npcs;
var NUM_OF_NPCS = 100;
var turnedBabies = 0;
var npcSprites = ['tanHuman', 'brownHuman', 'whiteHuman'];

/*
 * update vars
 */

/*
 * preload function
 */
function preload() {
	window.console.info('game: width: ' + game.width + ' height: ' + game.height);

	window.console.log('phaser: execute preload phase');

	game.load.spritesheet('dude', 'images/zombie-baby.png', 64, 64);
	game.load.spritesheet('attackingDude', 'images/attacking.png', 64, 64);
	game.load.spritesheet('tanHuman', 'images/tan-baby.png', 64, 64);
	game.load.spritesheet('brownHuman', 'images/brown-baby.png', 64, 64);
	game.load.spritesheet('whiteHuman', 'images/white-baby.png', 64, 64);
	game.load.spritesheet('turnedZombie', 'images/turned-baby.png', 64, 64);
}

/*
 * create function
 */
function create() {
	window.console.log('phaser: execute create phase');

	// The player and its settings
	player = game.add.sprite(100, 100, 'dude');

	player.body.collideWorldBounds = true;

	//  Our two animations, player walking
	player.animations.add('walking', [0, 1, 2, 3], 10, true);

	// Camera
	fixed = game.add.sprite(300, 320, 'player');
	fixed.fixedToCamera = true;
	fixed.cameraOffset.x = 300;
	fixed.cameraOffset.y = 300;

	game.camera.follow(player);

	// camera.follow(player, deadzone);
	//Phaser.Camera.x/y

	// npcs group
	npcs = game.add.group();

	// Create n number of npcs into the group.
	for (var i = 0; i < NUM_OF_NPCS; i++) {
		//  Create an npc inside of the 'npcs' group with random location and sprite
		var npc = npcs.create(Math.random() * (game.world.width - 64), Math.random() * (game.world.height - 64), npcSprites[(Math.floor(Math.random() * npcSprites.length))]);
		npc.body.collideWorldBounds = true;
		// example of adding property to npc
		// npc.name = 'npc' + i;
	}

	// Using the power of callAll we can add the same animation to all npcs in the group
	npcs.callAll('animations.add', 'animations', 'npcWalking', [0, 1, 2, 3], 10, true);
	// And play them
	npcs.callAll('animations.play', 'animations', 'npcWalking');

	//  Our controls.
	cursors = game.input.keyboard.createCursorKeys();
}

/*
 * update function
 */
function update() {
	// console.log('phaser: executing update phase');
	//  Reset the players velocity (movement)
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	// control movement of player
	if (cursors.left.isDown) {
		//  Move to the left
		player.body.velocity.x = -300;
		player.animations.play('walking');
	}
	if (cursors.right.isDown) {
		//  Move to the right
		player.body.velocity.x = 300;
		player.animations.play('walking');
	}
	if (cursors.up.isDown) {
		//  Move to the up
		player.body.velocity.y = -300;
		player.animations.play('walking');
	}
	if (cursors.down.isDown) {
		//  Move to the down
		player.body.velocity.y = 300;
		player.animations.play('walking');
	}
	if (!(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown)) {
		//  Stand still
		player.animations.stop();
		player.frame = 4;
	}

	// Checks to see if the player overlaps with any of the npcs, if player does call the turnNpc function
	game.physics.overlap(player, npcs, turnNpcToZombie, null, this);
}

/*
 * Turn npc into zombie by loading a new texture
 */
function turnNpcToZombie(player, npcs) {
	// Turn npc into zombie
	// TODO: may want to include turned zombie into sprite sheet and just change frame reference 
	// instead of loading new texture
	npcs.loadTexture('turnedZombie', 0);
	// Update animation to show walking 
	npcs.animations.add('turnedZombieWalking', [0, 1, 2, 3], 10, true);
	npcs.animations.play('turnedZombieWalking');
}