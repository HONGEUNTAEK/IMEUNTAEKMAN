import { Body } from "matter-js";
import { FRUITS } from "./fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    element : document.body,
    options : {
        wireframes : false,
        background : '#ffe380',
        width: 620,
        height : 850,
    }
});

// 벽 배치를 위한 world선언
const world = engine.world;

// 왼쪽 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic : true,
    render : { fillStyle: '#E6B143'}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic : true,
    render : { fillStyle: '#E6B143'}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic : true,
    render : { fillStyle: '#E6B143'}
});


const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic : true,
    isSensor : true,
    render : { fillStyle: '#E6B143'}
});

// 벽 월드에 배치
World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;

function addFruit() {

    // 과일 인덱스값 저장
    const index = Math.floor(Math.random() * 5);

    // 과일 이미지 경로 불러오기 변수
    const fruit = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index : index,
        isSleeping : true, // 시작시 바로 떨어지지 않고 잠시 멈춤
        render : {
            sprite : { texture : `${fruit.name}.png`},
        },

        // 통통 튀기는 설정
        restitution : 0.3
    })

    currentBody = body;
    currentFruit = fruit;

    World.add(world, body)
}

addFruit();

// window.onkeydown = (event) => {

// 	switch(event.code) {
// 	case "keyA":
//     Body.setPosition(currentBody, {
//         x : currentBody.Position.x ??
//     })
//     case "keyD":
//         case "keyS":
//   }
// }