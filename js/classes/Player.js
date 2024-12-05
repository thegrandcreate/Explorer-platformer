class Player extends Sprite {
	// Initialize the player using the Sprite class constructor
	constructor({position, CollisionBlocks, imageSrc, frameRate, scale = 6.5, animations}) {
		super({imageSrc, frameRate, scale})
		this.position = position
		this.velocity = {
			x: 0, 
			y: 1,
		}
		
		this.CollisionBlocks = CollisionBlocks
		this.animations = animations
		this.lastDirection = 'right'
		this.isOnGround = false

		//Load animation images
		for (let key in this.animations) {
			const image = new Image()
			image.src = this.animations[key].imageSrc

			this.animations[key].image = image
		}
		//Create a camera box to track the player's position for camera movement
		this.camerabox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 1350,
			height: 550,
		}

		//Double jump mechanics
		this.jumpCount = 0;
        this.maxJumps = 2;
	}

	//Jump function
	jump() {
        if (this.jumpCount < this.maxJumps) {
            this.velocity.y = -20; // Your jump velocity
            this.jumpCount++;
        }
    }
	
	// Resets jump count when the player lands
    land() {
        this.jumpCount = 0; // Reset jump count when landing
    }

	
	// Switches the player's animation to the specified key
	switchSprite(key) {
		if (this.image === this.animations[key].image || !this.loaded) return
		this.currentFrame = 0
		this.image = this.animations[key].image
		this.frameBuffer = this.animations[key].frameBuffer
		this.frameRate = this.animations[key].frameRate
		
	}

    // Updates the camera box to follow the player's position	
	updateCamerabox() {
		this.camerabox = {
			position: {
				x: this.position.x - 425,
				y: this.position.y + 300,
			},
			width: 1450,
			height: 600,
		}
	}

	 // Determines if the camera should pan left, right or down
	shouldPanCameraToTheLeft({canvas, camera}) {
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
		const scaledDownCanvasWidth = canvas.width /0.6

		if (cameraboxRightSide >= 4080) return

		if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x
		}
	}

	shouldPanCameraToTheRight({canvas, camera}) {
		if (this.camerabox.position.x <= 0) return

		if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x
		}
	}

	shouldPanCameraDown({canvas, camera}) {
		if (this.camerabox.position.y + this.velocity.y <= 0) return

		if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
			camera.position.y -= this.velocity.y
		}
	}

	shouldPanCameraUp({canvas, camera}) {
		if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 6880) return
		
		const scaledCanvasHeight = canvas.height / 0.6

		if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y)
		+ scaledCanvasHeight) {
			camera.position.y -= this.velocity.y
		}
	}

	update() {
		this.updateFrames()
		this.updateHitbox()
		this.updateCamerabox()
		this.draw()

		this.position.x += this.velocity.x
		this.updateHitbox()
		this.checkForHorizontalCollisions()
		this.applyGravity()
		this.updateHitbox()
		this.checkForVerticalCollisions()
	}

	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x + 250,
				y: this.position.y + 480
			}, 
			width: 100,
			height: 180
		}
	}

	// Checks and resolves horizontal collisions with blocks
	checkForHorizontalCollisions() {
		for (let i = 0; i < this.CollisionBlocks.length; i++) {
			const CollisionBlock = this.CollisionBlocks[i]

			if (
				collision({
					object1: this.hitbox,
					object2: CollisionBlock,
				}) 
			) {
				if (this.velocity.x > 0) {
					this.velocity.x = 0

					const offset = this.hitbox.position.x - this.position.x  + this.hitbox.width

					this.position.x = CollisionBlock.position.x - offset - 0.01
					break
				}

				if (this.velocity.x < 0) {
					this.velocity.x = 0

					const offset = this.hitbox.position.x - this.position.x 

					this.position.x = CollisionBlock.position.x + CollisionBlock.width - offset + 0.01 
				}
			}
		}
	}

	applyGravity() {
		this.velocity.y += gravity
		this.position.y += this.velocity.y
		
	}

	// Checks and resolves vertical collisions with blocks
	checkForVerticalCollisions() {
		this.isOnGround = false;
		for (let i = 0; i < this.CollisionBlocks.length; i++) {
			const CollisionBlock = this.CollisionBlocks[i]

			if (
				collision({
					object1: this.hitbox,
					object2: CollisionBlock,
				}) 
			) {
				if (this.velocity.y > 0) {
					this.velocity.y = 0

					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

					this.position.y = CollisionBlock.position.y - offset - 0.01
					this.isOnGround = true;
					this.land()
					break
				}

				if (this.velocity.y < 0) {
					this.velocity.y = 0

					const offset = this.hitbox.position.y - this.position.y 

					this.position.y = CollisionBlock.position.y + CollisionBlock.height - offset + 0.01 
					break
				}
			}
		}
	}
}