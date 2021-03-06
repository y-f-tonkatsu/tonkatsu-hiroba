var Ant;

(function(){
	
	var dist, mdist, distX, distY;
	
	Ant = function(ch, startPos){
		
		this._ch = ch;
		if(_.isUndefined(dist)){
			if(DisplayUtil.getSize() === 'small'){
				dist = ch.mdist;
			} else {
				dist = ch.dist;
			}
			mdist = ch.mdist;
			distX = ch.distX;
			distY = ch.distY;
		}
		
		this._startPos = startPos;
		
		this._current = {
			'x': startPos.x,
			'y': startPos.y
		};
		this._dest = {
			'x': startPos.x,
			'y': startPos.y
		};
		
		var vx = Math.random();
		var vy = 1 - Math.random();
		if(Math.random() > 0.5){vx = -vx;}
		if(Math.random() > 0.5){vy = -vy;}
		this._vector = {
			'x':vx,
			'y':vy
		};
		
		this._speed = Math.random() * 3;
		this._stamina = Math.floor(Math.random() * 120) + 120;
		
		this._color = {
			r: 0,
			g: 0,
			b: 0,
		}
		
		this._temptated = 0;
		this._pheromone = 0;
		
		this._food = 0;
		
	}
	
	Ant.prototype = {
		
		'update':function(){
			
			if(this.isRunout()){
				this.setVector(this.getHomeVector());
				this._pheromone -= 0.005;
			}
			
			this._dest.x += this._vector.x * this._speed + (Math.random() * 4 - 2);
			this._dest.y += this._vector.y * this._speed + (Math.random() * 4 - 2);

			this.draw(this._ch, this._current, this._dest);
			
			this._current.x = this._dest.x;
			this._current.y = this._dest.y;
			
			this._stamina -= 1;
			
		},
		
		
		'draw':function(ch, prev, dest){
			
			var r,g,b;
			
			ch.setStrokeStyle(255, 255, 200, 0.5);
			ch.setFillStyle(255, 255, 255, 0.2);
			
			ch.drawShape(function(ctx){
				ctx.arc(dest.x, dest.y, 2, 0, Math.PI * 2);
			}, false, true);
			
			if(this.isRunout()){
				r = 0;
				g = 200;
				b = 255 * this._pheromone;
			} else {
				r = 255 * this._temptated;
				g = 200 * (1 - this._temptated);
				b = 0;
			}
			
			ch.setStrokeStyle(r, g, b, 1);
			ch.drawShape(function(ctx){
				ctx.moveTo(prev.x, prev.y);
				ctx.lineTo(dest.x, dest.y);
			}, true);
			
		},
		
		'getPosition':function(){
			
			return this._current;
			
		},
		
		'putFood':function(v){
			
			this._food += v;
			
		},
		
		'setPheromoneStrength':function(v){
			
			this._pheromone = v;
			
		},
		
		'getPheromoneStrength':function(){
			
			return this._pheromone;
			
		},
		
		'setVector':function(pos){
			
			this._vector.x = pos.x;
			this._vector.y = pos.y;
			
		},
		
		'isRunout':function(){
			
			return this._stamina <= 0 ;
			
		},
		
		'isDead':function(){
			
			return this.isRunout() &&
				dist(this._current, this._startPos) < 10;
			
		},
		
		
		'temptate':function(pos, str, range){
			if(dist(this._current, pos) < range &&
				this._temptated <= str &&
				Math.random() * 5 <= str
			){
				this._temptated = str;
				this.setVector(this.getVectorFor(pos));
			}
			
		},
		
		'getVectorFor':function(pos){
			
			var rpos = {
				x: pos.x + Math.random() * 8 - 4,
				y: pos.y + Math.random() * 8 - 4,
			}
			
			
			var dx = distX(rpos, this._current);
			var dy = distY(rpos, this._current);
			var md = mdist(rpos, this._current);
			
			var vx = dx / md;
			var vy = dy / md;
			
			return {
				'x': vx,
				'y': vy
			};
			
		},
		
		'getHomeVector':function(){
			
			return this.getVectorFor(this._startPos);
			
		},
		
	}

})();