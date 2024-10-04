const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

// 중력 추가
const gravity = 0.2;

// 캔버스 그려주기
c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({position, velocity, color = "red", offset}) {
        this.position = position;

        this.velocity = velocity;

        this.width = 50;
        this.height = 175;
        // 키 중복입력 허용
        this.lastKey;

        // 공격 범위 그리기
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width : 100,
            height : 50,
            // 기준점 추가
            offset,
        };

        // 캐릭터 색 추가
        this.color = color;

        // 공격 중인지 확인
        this.isAttacking;

        // 체력 추가
        this.health = 100;

    }

    // 캐릭터 그려줌
    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // 공격 중일 때만 그리기
        if ( this.isAttacking ){
            c.fillStyle = "green";
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }

    }

    // 그려줌 갱신
    update() {
        this.draw();
        
        // 공격 범위의 값을 지정
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;
        // switchcase 방향 이동 적용
        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height)
        {
            this.velocity.y = 0;
        }
        else {
            this.velocity.y += gravity;
        }
    }

    // 공격함수 생성
    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
        // 공격 딜레이 걸기
    }

}

// 1p 선언
const player = new Sprite( {

    position : {
        x : 0,
        y : 0,
    },
    velocity : {
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: 0
    }
})

// 2p 선언
const enemy = new Sprite( {

    position : {
        x : 400,
        y : 100,
    },
    velocity : {
        x: 0,
        y: 10,
    },
    color : "blue",
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    }
}

function rectangulaCollision({ rectangle1, rectangle2}) {
    return (
        // 공격 충돌 판정
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function animate() {
    // 애니메이션 재생
    window.requestAnimationFrame(animate);
    // console.log("go")

    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if(keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
    }

    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
    }

    // 공격 충돌 판정
    if ( rectangulaCollision({rectangle1 : player, rectangle2 : enemy}) &&
        player.isAttacking
    ) {
        console.log('1p attack');
        player.isAttacking = false;

        // 공격 명중시 체력 감소
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }

    // 2p 공격 충돌 판정
    if ( rectangulaCollision({rectangle1 : enemy, rectangle2 : player}) &&
        enemy.isAttacking
    ) {
        console.log('2p attack');
        enemy.isAttacking = false;

        // 공격 명중시 체력 감소
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }
        
}



animate();

// 키보드 입력 받기
window.addEventListener("keydown", (event) => {
    // console.log(event.key)

    // update에    this.position.x += this.velocity.x; 적용
    switch(event.key) {
        // 1p 오른쪽 이동.
        case "d":
            keys.d.pressed = true;
            player.lastKey = "d"
            break;
        case "a":
            keys.a.pressed = true;
            player.lastKey = "a"
            break;
        case "w":
            player.velocity.y = -10;
            break;
        case " ":
            player.attack();
            break;

        // 2p 입력
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight"
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft"
            break;
        case "ArrowUp":
            enemy.velocity.y = -10;
            break;
        case "ArrowDown":
            enemy.attack();
            break;
    }
})

window.addEventListener("keyup", (event) => {
    // console.log(event.key)

    // update에    this.position.x += this.velocity.x; 적용
    switch(event.key) {
        // 1p 오른쪽 이동.
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;

        // 2p 입력
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
})