import { FRUITS } from "./fruits.js";

// 모듈 불러오기
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    // 조작을 위해 Body 선언
    Body = Matter.Body,
    Events = Matter.Events

// 엔진 선언
const engine = Engine.create();

// 렌더 선언(배경)
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false,  // true 배경색이 적용이 안됩니다.
        background: '#F7F4C8',
        width: 620,
        height: 850,
    }
});

// 벽 배치를 위한 world 선언
const world = engine.world;

// 왼쪽 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true, // 고정해 주는 기능
    render: { fillStyle: '#E6B143'} // 색상 지정
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: '#E6B143'}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: '#E6B143'}
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    // 게임 종료 이벤트 처리를 위해 이름을 지정
    name : "topLine",
    isStatic : true,
    isSensor : true,    // 충돌은 감지하는데, 물리엔진은 적용 안함
    render: { fillStyle: '#E6B143'}
});

// 벽 월드에 배치
World.add(world, [leftWall, rightWall, ground, topLine]);


Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;

// 키 제어 변수 생성
let interval = null;

function addFruit() {

    // 과일 인덱스값 저장
    const index = Math.floor(Math.random() * 5);

    // 과일 이미지 경로 불러오기 변수
    const fruit = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index : index,
        isSleeping : true,  // 시작시 바로 떨어지지 않고 잠시 멈춤
        render : {
            sprite : { texture : `${fruit.name}.png`},
        },

        // 통통 튀기는 설정
        restitution : 0.5,
    })

    currentBody = body;
    currentFruit = fruit;

    World.add(world, body)
}

// 키보드 입력 함수
window.onkeydown = (event) => {

    if(disableAction)
        return;

    switch(event.code) {
        case "KeyA":
            if (interval)
                return;
            // 인터벌 변수를 사용, 밀리초 단위로 함수를 반복
            interval = setInterval(() => {
                    if(currentBody.position.x - currentFruit.radius > 30)
                    Body.setPosition(currentBody, {
                        x: currentBody.position.x - 1,
                        y: currentBody.position.y,
                });
            }, 5)    

            if(currentBody.position.x - currentFruit.radius > 30)
                Body.setPosition(currentBody, {
                    x: currentBody.position.x - 10,
                    y: currentBody.position.y,
            });
            break;
        case "KeyD":
            if (interval)
                return;
            // 인터벌 변수를 사용, 밀리초 단위로 함수를 반복
            interval = setInterval(() => {
                if(currentBody.position.x - currentFruit.radius < 590)
                Body.setPosition(currentBody, {
                    x: currentBody.position.x + 1,
                    y: currentBody.position.y,
                });
            }, 5)  

            if(currentBody.position.x + currentFruit.radius < 590)
                Body.setPosition(currentBody, {
                    x: currentBody.position.x + 10,
                    y: currentBody.position.y,
            });
            break;
        case "KeyS":
            // isSleeping을 false로 해서 과일을 떨어트림
            currentBody.isSleeping = false;
            // 1초 대기 후 새로운 과일 생성
            disableAction = true;
            setTimeout(() => {
                addFruit();
                disableAction = false;
            },1000)
            break;

    }
}

window.onkeyup = (event) => {
    switch (event.code) {
        case "KeyA":
        case "KeyD":
            clearInterval(interval);
            interval = null;
    }
}

// 이벤트 사용
Events.on(engine, "collisionStart", (event) => {

    // 모든 충돌에 대해서 이벤트 발생
    event.pairs.forEach((collision) => {
        if(collision.bodyA.index == collision.bodyB.index) {

            // 기존 과일의 index를 저장
            const index = collision.bodyA.index;

            // 수박일 경우 처리하지 않음
            if ( index === FRUITS.length - 1)
                return;

            // 같은 과일 제거
            World.remove(world, [collision.bodyA, collision.bodyB]);

            // 저장한 index값에 1을 더해 새로운 과일 생성
            const newFruit = FRUITS[index +1];
            const newBody = Bodies.circle(
                // 부딪힌 지점의 x, y값
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    // 과일이 합쳐졌으므로 index + 1
                    index : index + 1,
                    render : { sprite : { texture: `${newFruit.name}.png`}},
                }
            )

            // 생성한 과일 월드에 추가
            World.add(world, newBody)
        }

        if ( !disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
            alert("gmae over");
            disableAction = true;
        }
    })
})



addFruit();