document.addEventListener('DOMContentLoaded', () => {

    
    //Declaration

    const width = 10
    const depth = 20
    const displayWidth = 5
    const displayDepth = 6

    let grid = document.getElementsByClassName('grid')[0];
    for (let i = 0; i < width*(depth+1); i++) {
        let element = document.createElement('div');
        if (i >= width*depth) {
            element.classList.add('taken');
        }
        grid.appendChild(element);
    }
    let squares = Array.from(document.querySelectorAll('.grid div'))

    let miniGrid = document.getElementsByClassName('mini-grid')[0];
    for (let i = 0; i < displayWidth*displayDepth; i++) {
        miniGrid.appendChild(document.createElement('div'));
    }
    const displaySquares = document.querySelectorAll('.mini-grid div')

    const startBtn = document.querySelector('#start-button')
    const restartBtn = document.querySelector('#restart-button')
    const leftBtn = document.querySelector('#left-button')
    const upBtn = document.querySelector('#up-button')
    const rightBtn = document.querySelector('#right-button')
    const downBtn = document.querySelector('#down-button')
    
    const scoreDisplay = document.querySelector('#score')
    const levelDisplay = document.querySelector('#level')
    const rowDisplay = document.querySelector('#row')
    
    const greenColor = '#1fa812'
    const redColor = '#b40a0a'
    const greenLight = '#30c023'
    const redLight = '#cc1f1f'
    let blinkState = false
    const timeBlink = 500
    let timerColor

    let score = 0
    let rowCount = 0
    let level = 0
    let state = 'prestart'
    
    let timerId
    const speedDial = 6
    const speedTable = [80, 65, 50, 40, 32, 25, 20, 17, 15, 13]
    let timeStep = speedDial * speedTable[level]
    let drop = 1
    let bonus = 0
    const bonusTable = [0, 100, 400, 900, 2500]
    const levelTable = [10, 60, 90, 120, 150, 200, 250, 300, 350]


    //Tetrominoes

    const iTetromino = {
        rotations: [[width, width+1, width+2, width+3],
                    [2, width+2, width*2+2, width*3+2],
                    [width*2, width*2+1, width*2+2, width*2+3],
                    [1, width+1, width*2+1, width*3+1]],
        color: '#68cdff',
        display:    [-displayWidth+1, 1, displayWidth+1, displayWidth*2+1]
    }

    const oTetromino = {
        rotations: [[1, 2, width+1, width+2],
                    [1, 2, width+1, width+2],
                    [1, 2, width+1, width+2],
                    [1, 2, width+1, width+2]],
        color: '#ffff09',
        display:    [0, 1, displayWidth, displayWidth+1]
    }

    const tTetromino = {
        rotations: [[2, width+1, width+2, width+3],
                    [2, width+2, width+3, width*2+2],
                    [width+1, width+2, width+3, width*2+2],
                    [2, width+1, width+2, width*2+2]],
        color: '#cd04ff',
        display:    [1, displayWidth, displayWidth+1, displayWidth+2]
    }

    const jTetromino = {
        rotations: [[1, width+1, width+2, width+3],
                    [2, 3, width+2, width*2+2],
                    [width+1, width+2, width+3, width*2+3],
                    [2, width+2, width*2+1, width*2+2]],
        color: '#0601ff',
        display:    [0, displayWidth, displayWidth+1, displayWidth+2]
    }

    const lTetromino = {
        rotations: [[3, width+1, width+2, width+3],
                    [2, width+2, width*2+2, width*2+3],
                    [width+1, width+2, width+3, width*2+1],
                    [1, 2, width+2, width*2+2]],
        color: '#ff6702',
        display:    [2, displayWidth, displayWidth+1, displayWidth+2]
    }
    
    const sTetromino = {
        rotations: [[2, 3, width+1, width+2],
                    [2, width+2, width+3, width*2+3],
                    [width+2, width+3, width*2+1, width*2+2],
                    [1, width+1, width+2, width*2+2]],
        color: '#0eff0a',
        display:    [1, 2, displayWidth, displayWidth+1]
    }

    const zTetromino = {
        rotations: [[1, 2, width+2, width+3],
                    [3, width+2, width+3, width*2+2],
                    [width+1, width+2, width*2+2, width*2+3],
                    [2, width+1, width+2, width*2+1]],
        color: '#ff0501',
        display:    [0, 1, displayWidth+1, displayWidth+2]
    }

    const theTetrominoes = [iTetromino, oTetromino, tTetromino, jTetromino, lTetromino, sTetromino, zTetromino]

    const startPosition = 3
    let currentPosition = startPosition
    let currentRotation = 0
    const displayIndex = displayWidth*2+1

    let nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random]['rotations'][currentRotation]


    //Display

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = theTetrominoes[random]['color']
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })    
    }

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        theTetrominoes[nextRandom]['display'].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = theTetrominoes[nextRandom]['color']
        })
    }


    //Controles

    function control(e) {
        if(e.keyCode == 37) {
            moveLeft()
        } else if(e.keyCode == 38) {
            rotate()
        } else if(e.keyCode == 39) {
            moveRight()
        } else if(e.keyCode == 40) {
            droping()
        }
    }
    document.addEventListener('keydown', control)

    leftBtn.addEventListener('mousedown', () => {moveLeft()})
    upBtn.addEventListener('mousedown', () => {rotate()})
    rightBtn.addEventListener('mousedown', () => {moveRight()})
    downBtn.addEventListener('mousedown', () => {droping()})

    function droping() {
        if (state==='play') {
            drop ++
            clearInterval(timerId)
            timerId = setInterval(moveDown, timeStep)
            moveDown()
        }
    }

    function moveDown() {
        if (state==='play') {
            undraw()
            currentPosition += width
            if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition -= width
                draw()
                freeze()
            } else {
                draw()
            }
        }
    }

    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
      }
      
      function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
      }
      

    function moveLeft() {
        if (state==='play') {
            undraw()
            if(!isAtLeft()) currentPosition -=1
            if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition +=1
            }
            draw()
        }
    }

    function moveRight() {
        if (state==='play') {
            undraw()
            if(!isAtRight()) currentPosition +=1
            if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition -=1
            }
            draw()
        }
    }

    function checkRotatedPosition(P){
        P = P || currentPosition        //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {        //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
            if (isAtRight()){           //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()){
                currentPosition -= 1
            checkRotatedPosition(P)
            }
        }
    }
      
    function rotate() {
        if (state==='play') {
            let tempPosition = currentPosition
            let tempRotation = currentRotation
            let currentTetromino = theTetrominoes[random]['rotations']
            undraw()
            currentRotation = (currentRotation+1) % currentTetromino.length
            current = currentTetromino[currentRotation]
            checkRotatedPosition()
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
                currentRotation = tempRotation
                currentPosition = tempPosition
                current = currentTetromino[currentRotation]
            }
            draw()
        }
    }


    //Mechanics

    function blink(button, newColor, oldColor) {
        return function () {
            blinkState = !blinkState
            if(blinkState) {
                button.style.backgroundColor = newColor
            } else {
                button.style.backgroundColor = oldColor
            }
        }
    }

    restartBtn.addEventListener('click', () => {restart()})

    startBtn.addEventListener('click', () => {
        if (state === 'pause') {
            state = 'play'
            startBtn.style.backgroundColor = greenColor
            draw()
            clearInterval(timerColor)
            timerId = setInterval(moveDown, timeStep)
            displayShape()
        } else if (state === 'prestart' || state === 'over') {
            restart()
        } else if (state === 'play') {
            state = 'pause'
            timerColor = setInterval(blink(startBtn, greenLight, greenColor), timeBlink)
            clearInterval(timerId)
        }
    })

    function restart() {
        state = 'play'
        startBtn.style.backgroundColor = greenColor
        restartBtn.style.backgroundColor = redColor
        clearInterval(timerColor)
        squares.forEach(square => {
            square.classList.remove('tetromino')
            square.classList.remove('taken')
            square.style.backgroundColor = ''
        })
        for (let i = 0; i < width; i++) {
            squares[width*depth +i].classList.add('taken');
        }
        score = 0
        rowCount = 0
        level = 0
        levelDisplay.innerHTML = level
        scoreDisplay.innerHTML = score
        rowDisplay.innerHTML = rowCount
        timeStep = speedDial * speedTable[level]
        drop = 1
        bonus = 0
        currentPosition = startPosition
        currentRotation = 0
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        random = Math.floor(Math.random()*theTetrominoes.length)
        current = theTetrominoes[random]['rotations'][currentRotation]
        clearInterval(timerId)
        draw()
        timerId = setInterval(moveDown, timeStep)
        displayShape()
    }

    function freeze() {
        clearInterval(timerId)
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        addScore()

        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random]['rotations'][currentRotation]
        currentPosition = startPosition
        draw()
        displayShape()
        timerId = setInterval(moveDown, timeStep)
        gameOver()
    }

    function addScore() {
        score += Math.min(drop * (1+level) * (level + depth-Math.floor(currentPosition/width)), 999)
        scoreDisplay.innerHTML = score
        drop = 1
        let bonusRow = 0
        for (let i = 0; i < width*depth; i +=width) {
            const row = Array.from(Array(width), (_, j) => j+i)

            if(row.every(index => squares[index].classList.contains('taken'))) {
                rowCount ++
                bonusRow ++
                rowDisplay.innerHTML = rowCount
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
        bonus += bonusTable[bonusRow]
        if(rowCount>=levelTable[level]){
            level ++
            score += bonus
            levelDisplay.innerHTML = level
            scoreDisplay.innerHTML = score
            bonus = 0
            timerId = speedDial * speedTable[level]
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            clearInterval(timerId)
            state = 'over'
            timerColor = setInterval(blink(restartBtn, redLight, redColor), timeBlink)
        }
    }

})



