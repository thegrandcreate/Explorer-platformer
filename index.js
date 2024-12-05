//Create canvas and set its size
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
	
canvas.width = 1024
canvas.height = 576

//Scale canvas for rendering
const scaledCanvas = {
	width: canvas.width / 0.6,
	height: canvas.height / 0.6,
}

//Define gravity for player
const gravity = 0.5


//Get collision data into a 2D array
const floorCollisions2D = []
for (let i=0; i < floorCollisions.length; i += 51) {
	floorCollisions2D.push(floorCollisions.slice(i, i + 51))
}

//Build the actual collision blocks based on the data
const CollisionBlocks = []
floorCollisions2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 10270) { //10270 represents a collision block from collisions.js
			CollisionBlocks.push(
				new CollisionBlock({
				position: {
				x: x * 80,
				y: y * 80,
				},
			})
		)
		}
	})
})






//Create the player
const player = new Player({
	position: {
	x: 700,
	y: 6000,
	},
	CollisionBlocks,
	imageSrc: './img/samurai/IDLE.png',
	frameRate: 5,
	animations: { //Define animations for the player and set their speeds
		Idle: {
			imageSrc: './img/samurai/IDLE.png',
			frameRate: 5,
			frameBuffer: 5,
		},
		IdleLeft: {
			imageSrc: './img/samurai/IDLELEFT.png',
			frameRate: 5,
			frameBuffer: 5,
		},Idle: {
			imageSrc: './img/samurai/IDLE.png',
			frameRate: 5,
			frameBuffer: 5,
		},
		Run: {
			imageSrc: './img/samurai/RUN.png',
			frameRate: 5,
			frameBuffer: 5,
		},
		RunLeft: {
			imageSrc: './img/samurai/RUNLEFT.png',
			frameRate: 5,
			frameBuffer: 5,
		},
		Jump: {
			imageSrc: './img/samurai/JUMP.png',
			frameRate: 5,
			frameBuffer: 25,
		},
		JumpLeft: {
			imageSrc: './img/samurai/JUMPLEFT.png',
			frameRate: 5,
			frameBuffer: 20,
		},
		Fall: {
			imageSrc: './img/samurai/FALL.png',
			frameRate: 5,
			frameBuffer: 9,
		},

		FallLeft: {
			imageSrc: './img/samurai/FALLLEFT.png',
			frameRate: 5,
			frameBuffer: 9,
		}
	},
})

//Track state of keys for movement
const keys = {
	d: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
}

//Create background
const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: './img/nightv1.png'
})

const backgroundImageHeight = 6880

//Create camera controls
const camera = {
	position: {
		x: 0,
		y: -backgroundImageHeight + scaledCanvas.height,
	},
}

//Game loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(0.6, 0.6);
    c.translate(camera.position.x, camera.position.y);

    background.update();

	player.update();

	const leftBoundary = 0;
    const rightBoundary = 4080 - player.hitbox.width;

	//Add collision to sides of canvas 
    if (player.hitbox.position.x < leftBoundary) {
        player.position.x = leftBoundary - (player.hitbox.position.x - player.position.x);
        player.velocity.x = 0;
    } else if (player.hitbox.position.x > rightBoundary) {
        player.position.x = rightBoundary - (player.hitbox.position.x - player.position.x);
        player.velocity.x = 0;
    }

	//Player movement controls and animations
	player.velocity.x = 0; 
    if (keys.d.pressed) {
        player.velocity.x = 10;
        player.lastDirection = 'right';
		player.shouldPanCameraToTheLeft({canvas, camera})
        if (player.isOnGround) {
            player.switchSprite('Run');
        }
    } else if (keys.a.pressed) {
        player.velocity.x = -10;
        player.lastDirection = 'left';
		player.shouldPanCameraToTheRight({canvas, camera})
        if (player.isOnGround) {
            player.switchSprite('RunLeft');
        }
    } else if (player.isOnGround) {
        if (player.lastDirection === 'right') {
            player.switchSprite('Idle');
        } else {
            player.switchSprite('IdleLeft');
        }
    }

	
	//Handle vertical animations
    if (player.velocity.y < 0) {
		player.shouldPanCameraDown({camera, canvas})
        if (player.lastDirection === 'right') {
            player.switchSprite('Jump');
        } else {
            player.switchSprite('JumpLeft');
        }
    } else if (player.velocity.y > 0) {
		player.shouldPanCameraUp({camera, canvas})
        if (player.lastDirection === 'right') {
            player.switchSprite('Fall');
        } else {
            player.switchSprite('FallLeft');
        }
    }

    c.restore();
}

animate(); //Start the game loop

//Handle key presses for movement
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            player.jump() 
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            // Optionally cut the jump short if the key is released early
            if (player.velocity.y < -10) {
                player.velocity.y = -10
            }
            break
    }
})