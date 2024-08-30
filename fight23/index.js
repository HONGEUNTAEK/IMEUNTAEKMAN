const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

// 중력 추가
const gravity = 0.2;

// 캔버스 그려주기
c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({position, velocity}) {
        this.position = position;

        this.velocity = velocity;

        this.width = 50;
        this.height = 150;
    }

    // 캐릭터 그려줌
    draw(){
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height, 50, 150);
        
    }

    // 그려줌 갱신
    update() {
        this.draw();

        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height)
        {
            this.velocity.y = 0;
            console.log()
        }
        else {
            this.velocity.y += gravity;
        }
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
    }
})


function animate() {
    // 애니메이션 재생
    window.requestAnimationFrame(animate);
    console.log("go") // 테스트용

    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update();
    enemy.update();
}

animate();