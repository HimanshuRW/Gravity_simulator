var c = document.getElementById("myCanvas");
var head1 = document.getElementById("head1");
var myArrow1 = document.getElementById("myArrow1");
var vector1 = document.getElementById("vector1");

var head2 = document.getElementById("head2");
var myArrow2 = document.getElementById("myArrow2");
var vector2 = document.getElementById("vector2");

const m2_input_x = document.getElementById("m2_input_x");
const m2_input_y = document.getElementById("m2_input_y");
const m1_input_y = document.getElementById("m1_input_y");
const m1_input_x = document.getElementById("m1_input_x");

function set_position(p,dir,val) {
    let particle = p==1? m1:m2;
    if(dir=='x') particle.px = +val;
    if(dir=='y') particle.py = +val;

    draw_board();
}
function set_mass(p,val) {
    let particle = p==1? m1:m2;
    particle.mass = +val;

    draw_board();
}

const btn = document.getElementById("btn");

var ctx = c.getContext("2d");

let m1 = {
    mass : 6,
    px : 20,
    py : 20,
    vx : -3,
    vy : 5,
    ax : 0,
    ay : 0
};
let m2 = {
    mass : 10,
    px : 100,
    py : 60,
    vx : 4,
    vy : -3,
    ax : 0,
    ay : 0
};

let timeStep = 0.2;
const G = 1200;
let running = false;

btn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(running) { running = false }
    else { running = true; animate(); }
});

function draw_board() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.beginPath();
    ctx.arc(m1.px, m1.py, m1.mass, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498db";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(m2.px, m2.py, m2.mass, 0, 2 * Math.PI);
    ctx.fillStyle = "tomato";
    ctx.fill();
}

function update_acceleration() {
    const F = getForce();
    const theta = getTheta();
    const m1_a = ((F)/(m1.mass));

    m1.ax =( (m1_a)*(Math.cos(theta)) );
    m1.ax =( (Math.abs(m1.ax)) * (Math.sign(m2.px-m1.px))  );
    m1.ay =( (m1_a)*(Math.sin(theta)) );
    m1.ay =( (Math.abs(m1.ax)) * (Math.sign(m2.py-m1.py))  );


    const m2_a = ((F)/(m2.mass));
    m2.ax =( (m2_a)*(Math.cos(theta)) );
    m2.ax =( (Math.abs(m2.ax)) * (Math.sign(m1.px-m2.px))  );
    m2.ay =( (m2_a)*(Math.sin(theta)) );
    m2.ay =( (Math.abs(m2.ax)) * (Math.sign(m1.py-m2.py))  );

    console.log(`ax1 : ${m1.ax},  ay1 : ${m1.ay}`);
    console.log(`ax2 : ${m2.ax},  ay2 : ${m2.ay}`);

}

function update_board() {
    m1.vx += m1.ax * (timeStep);
    m1.px += m1.vx * (timeStep);
    m2.vx += m2.ax * (timeStep);
    m2.px += m2.vx * (timeStep);

    m1.vy += m1.ay * (timeStep);
    m1.py += m1.vy * (timeStep);
    m2.vy += m2.ay * (timeStep);
    m2.py += m2.vy * (timeStep);
}

function getDist() {
    let distx = m1.px-m2.px;
    let disty = m1.py-m2.py;
    let dist = Math.pow(distx,2) + Math.pow(disty,2);
    return Math.sqrt(dist);
}

function getForce() {
    let r = getDist();
    let r2 = Math.pow(r,2);
    let F = G *  ( ( (m1.mass)*(m2.mass) / r2 ) );
    return F;
}

function getTheta() { // from the x axis... and from the pov of m1
    let distx = m1.px-m2.px;
    let disty = m1.py-m2.py;
    let tan0 = disty/distx;
    let theta = Math.atan(tan0);
    console.log(theta); 
    return theta;
}

function animate() {
    update_acceleration();
    update_board();
    draw_board();
    if(running)
    requestAnimationFrame(animate);
}
// animate();
draw_board();

head1.addEventListener("drag", e=>dragging(e,1));
head1.addEventListener("dragend", e=>dragging(e,1));
head1.addEventListener("dragstart", e=>dragging(e,1));

function dragging(e,particle) {
    let vector, head,myArrow,myBall;
    if(particle == 1) {
        vector = vector1;
        head = head1;
        myArrow = myArrow1;
        myBall = m1;
    } else {
        vector = vector2;
        head = head2;
        myArrow = myArrow2;
        myBall = m2;
    }
    myDrag(e,vector,head,myArrow,myBall);
}

function myDrag(e,vector,head,myArrow,myBall) {
    let v = vector.getBoundingClientRect();
    let distx = e.clientX - v.left;
    let disty = e.clientY - v.top;
    console.log(distx);
    head.style.left = `${distx}px`;
    head.style.top = `${disty}px`;
    let toroot = Math.pow((distx - 60),2)+ Math.pow((disty-60),2);
    myArrow.style.width = `${Math.sqrt(toroot)}px`;
    let theta_rad = Math.atan((disty-60)/(distx-60));
    let theta_deg = rad_to_deg(theta_rad);
    if(distx-60 < 0) theta_deg += 180;
    myArrow.style.transform = `translateY(-50%) rotateZ(${theta_deg}deg)`;
    
    let distance = Math.sqrt( Math.pow(distx,2) + Math.pow(disty,2)  );
    let vel_x = distance * (Math.cos(deg_to_rad(theta_deg)));
    let vel_y = distance * (Math.sin(deg_to_rad(theta_deg)));
    myBall.vx = vel_x * (timeStep/4);
    myBall.vy = vel_y * (timeStep/4);

}
head2.addEventListener("drag", e=>dragging(e,2));
head2.addEventListener("dragend", e=>dragging(e,2));
head2.addEventListener("dragstart", e=>dragging(e,2));

function rad_to_deg(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function deg_to_rad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}