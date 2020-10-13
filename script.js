window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 500;
    var ctx;
    var blockSize = 20;
    var delay = 100;
    var snakee;
    var applee;
    var widtInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;

    init()

    function  init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4], [4,4]], "right");
        applee = new Apple([4,3]);
        score = 0;
        refreshCanvas();
    
    }

    function refreshCanvas(){  
        snakee.advance();
        if(snakee.checkCollision())
        {
            // Game Over
            gameOver();
        }
        else
       {
           if(snakee.isEatingApple(applee))
           {
               score++;
               snakee.ateApple = true;
                do
                {
                    applee.setNewPosition();
                }
                while(applee.verifyPosition(snakee))
           }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas, delay);
        }
    }
    function gameOver(){
        ctx.save();
        ctx.font = "bold 30px san-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", centerX, centerY - 100);
        ctx.strokeText("Game Over", centerX, centerY - 100);
        ctx.fillText("Your score : ", centerX, centerY - 65);
        ctx.strokeText("Your score : ", centerX, centerY - 65);
        ctx.fillText("Press Space to replay", centerX, centerY + 50);
        ctx.strokeText("Press Space to replay", centerX, centerY + 50);
        ctx.restore();
    }

    function restart(){
        var list = ["left", "up", "right", "down"]
        snakee = new Snake([[6,4], [5,4], [4,4]], "right");
        applee = new Apple([Math.round(Math.random() * 15),Math.round(Math.random() * 10)])
        refreshCanvas();
        clearTimeout(timeout);
        score = 0;
    
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 100px san-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.textBaseline = "middle"; 
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);

    }

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0004";
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();

        };
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                default:
                    throw("Invalid Direction")
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction")
            }
            if (allowedDirections.indexOf(newDirection) >= 0) 
            {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function (){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0, minY = 0;
            var maxX = widtInBlocks - 1;
            var maxY =heightInBlocks - 1;
            var betweenX = snakeX < minX || snakeX > maxX;
            var betweenY = snakeY < minY || snakeY > maxY;
            if (betweenX || betweenY)
            {
                wallCollision = true;
            }
            for(var i = 0; i < rest.length; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleTopEat){
            var head = this.body[0];
            if(head[0] === appleTopEat.position[0] && head[1] === appleTopEat.position[1])
                return true;
            else return false;
        };
    }

    function Apple(position){
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widtInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        this.verifyPosition = function(snake){
            var isOnSnake = false;
            for (var i = 0; i < snake.body.length; i++)
            {
                if (this.position[0] === snake.body[i][0] && this.position[1] === snake.body[i][1])
                {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    document.onkeydown = function handleKeyDown(e){
    var key = e.keyCode;
    var newDirection;
    switch(key){
        case 37:
            newDirection = "left";
            break;
        case 38:
            newDirection = "up";
            break;
        case 39:
            newDirection = "right";
            break;
        case 40:
            newDirection = "down";
            break;
        case 32:
            restart();
            return;
        default:
            return;
    }

    snakee.setDirection(newDirection);

    }

}