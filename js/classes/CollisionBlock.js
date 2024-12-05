class CollisionBlock {
	constructor({ position }) {
		//Set collision blocks position and dimensions
		this.position = position
		this.width = 80
        this.height = 80
	}
    
	// Draw the block on the canvas (was useful for debugging the collisions)
	draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}

	update() {
		this.draw()
	}
}