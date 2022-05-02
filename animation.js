var canvas = document.getElementById('nokey'),
can_w = parseInt(canvas.getAttribute('width')),
can_h = parseInt(canvas.getAttribute('height')),
can_top = parseInt(canvas.getAttribute('offsetTop')),
ctx = canvas.getContext('2d'),
dx = 100,
dy = 100;

// console.log(typeof can_w);

var ball = {
x_0: 0,
y_0: 0,
x: 0,
y: 0,
vx: 0,
vy: 0,
r: 0,
alpha: 1,
phase: 0
},
ball_color = {
r: 207,
g: 255,
b: 4
},
R = 1.4,
balls = [],
alpha_f = 0.03,
alpha_phase = 0,

// Line
link_line_width = 0.8,
dis_limit = 260,
add_mouse_point = true,
mouse_in = false,
mouse_ball = {
x: 0,
y: 0,
vx: 0,
vy: 0,
r: 0,
type: 'mouse'
};

// Random speed
function getRandomSpeed(pos){
	var  min = -1,
	max = 1;
	switch(pos){
		case 'top':
			return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
			break;
		case 'right':
			return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
			break;
		case 'bottom':
			return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
			break;
		case 'left':
			return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
			break;
		default:
			return;
			break;
	}
}
function randomArrayItem(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
	return Math.random()*(max - min) + min;
}
console.log(randomNumFrom(0, 10));
// Random Ball
function getRandomBall(){
	var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
	switch(pos){
		case 'top':
			return {
			x: randomSidePos(can_w),
			y: -R,
			vx: getRandomSpeed('top')[0],
			vy: getRandomSpeed('top')[1],
			r: R,
			alpha: 1,
			phase: randomNumFrom(0, 10)
			}
			break;
		case 'right':
			return {
			x: can_w + R,
			y: randomSidePos(can_h),
			vx: getRandomSpeed('right')[0],
			vy: getRandomSpeed('right')[1],
			r: R,
			alpha: 1,
			phase: randomNumFrom(0, 10)
			}
			break;
		case 'bottom':
			return {
			x: randomSidePos(can_w),
			y: can_h + R,
			vx: getRandomSpeed('bottom')[0],
			vy: getRandomSpeed('bottom')[1],
			r: R,
			alpha: 1,
			phase: randomNumFrom(0, 10)
			}
			break;
		case 'left':
			return {
			x: -R,
			y: randomSidePos(can_h),
			vx: getRandomSpeed('left')[0],
			vy: getRandomSpeed('left')[1],
			r: R,
			alpha: 1,
			phase: randomNumFrom(0, 10)
			}
			break;
	}
}
function randomSidePos(length){
	return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
	Array.prototype.forEach.call(balls, function(b){
								 if(!b.hasOwnProperty('type')){
								 ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
								 ctx.beginPath();
								 ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
								 ctx.closePath();
								 ctx.fill();
								 }
								 });
}

// Update balls
function updateBalls(){
	var new_balls = [];
	var theta, radius;
	Array.prototype.forEach.call(balls, function(b){
								 
								 if (b.x == mouse_ball.x && b.y == mouse_ball.y) {
								 
								 }
								 else {
								 	 theta = Math.atan((mouse_ball.y - b.y) / (mouse_ball.x - b.x));
									 if (mouse_ball.x - b.x < 0) {
								 		theta += Math.PI;
									 }
								 	 b.vx = .3 * Math.cos(theta);
								 	 b.vy = .3 * Math.sin(theta);
								 
								 	 radius = Math.min(100, 10000 / Math.sqrt(((b.x - mouse_ball.x) ** 2 + (b.y - mouse_ball.y) ** 2)));
									 //radius = 10;
									 if ((b.x + b.vx - b.x_0) ** 2 + (b.y + b.vy - b.y_0) ** 2 < radius) {
										 b.x += b.vx;
										 b.y += b.vy;
									 }
								 
									 if (!(b.x == b.x_0 && b.y == b.y_0)) {
										 theta = Math.atan((b.y_0 - b.y) / (b.x_0 - b.x));
										 if (b.x_0 - b.x < 0) {
											theta += Math.PI;
										 }
										 b.vx = .1 * Math.cos(theta);
										 b.vy = .1 * Math.sin(theta);
								 
										 b.x += b.vx;
										 b.y += b.vy;
								 	 }
								 
								 }
								 
								 if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
								 new_balls.push(b);
								 }
								 
								 // alpha change
								 b.phase += alpha_f;
								 b.alpha = .75 * Math.abs(Math.cos(b.phase));
								 // console.log(b.alpha);
								 });
	
	balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
	
}

// Draw lines
function renderLines(){
	var fraction, alpha;
	for (var i = 0; i < balls.length; i++) {
		for (var j = i + 1; j < balls.length - 1; j++) {
			
			fraction = getDisOf(balls[i], balls[j]) / dis_limit;
			
			if(fraction < 1){
				alpha = .25 * (1 - fraction).toString();
				
				ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
				ctx.lineWidth = link_line_width;
				
				ctx.beginPath();
				ctx.moveTo(balls[i].x, balls[i].y);
				ctx.lineTo(balls[j].x, balls[j].y);
				ctx.stroke();
				ctx.closePath();
			}
		}
		for (var j = balls.length - 1; j < balls.length; j++) {
			
			fraction = getDisOf(balls[i], balls[j]) / dis_limit;
			
			if(fraction < 1){
				alpha = (1 - fraction).toString();
				
				ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
				ctx.lineWidth = link_line_width;
				
				ctx.beginPath();
				ctx.moveTo(balls[i].x, balls[i].y);
				ctx.lineTo(balls[j].x, balls[j].y);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
}

// calculate distance between two points
function getDisOf(b1, b2){
	var  delta_x = Math.abs(b1.x - b2.x),
	delta_y = Math.abs(b1.y - b2.y);
	
	return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
	if(balls.length < 20){
		balls.push(getRandomBall());
	}
}

// Render
function render(){
	ctx.clearRect(0, 0, can_w, can_h);
	
	renderBalls();
	
	renderLines();
	
	updateBalls();
	
	//addBallIfy();
	
	window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
	var angle = .05;
	var pos_x, pos_y;
	for(var i = -Math.floor(can_w / dx / 2) - 3; i <= can_w / dx / 2 + 3; i++){
		for(var j = -Math.floor(can_h / dx / 2) - 3; j <= can_h / dx / 2 + 3; j++){
			pos_x = (can_w / 2 + i * dx) * Math.cos(angle * Math.PI) + (can_h / 2 + j * dy) * Math.sin(angle * Math.PI);
			pos_y = (can_h / 2 + j * dy) * Math.cos(angle * Math.PI) - (can_h / 2 + i * dy) * Math.sin(angle * Math.PI);
			balls.push({
					   x_0: pos_x,
					   y_0: pos_y,
					   x: pos_x,
					   y: pos_y,
					   vx: 0,
					   vy: 0,
					   r: R,
					   alpha: 1,
					   phase: randomNumFrom(0, 10)
					   });
		}
	}
}
// Init Canvas
function initCanvas(){
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);
	
	can_w = parseInt(canvas.getAttribute('width'));
	can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
						console.log('Window Resize...');
						initCanvas();
						});

function goMovie(){
	initCanvas();
	initBalls(10);
	window.requestAnimationFrame(render);
}
goMovie();

// Mouse effect
canvas.addEventListener('mouseenter', function(){
						console.log('mouseenter');
						mouse_in = true;
						balls.push(mouse_ball);
						});
canvas.addEventListener('mouseleave', function(){
						console.log('mouseleave');
						mouse_in = false;
						var new_balls = [];
						Array.prototype.forEach.call(balls, function(b){
													 if(!b.hasOwnProperty('type')){
													 new_balls.push(b);
													 }
													 });
						balls = new_balls.slice(0);
						});
canvas.addEventListener('mousemove', function(e){
						var e = e || window.event;
						var rect = canvas.getBoundingClientRect();
						mouse_ball.x = event.clientX * can_w / rect.right;
						mouse_ball.y = event.clientY - rect.top;
						// console.log(mouse_ball);
						});
