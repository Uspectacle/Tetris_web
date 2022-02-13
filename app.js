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
            element.classList.add('ground');
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

    const music = document.getElementById("music");
    const musicBtn = document.querySelector('#music-button')

    const startBtn = document.querySelector('#start-button')
    const restartBtn = document.querySelector('#restart-button')
    const leftBtn = document.querySelector('#left-button')
    const upBtn = document.querySelector('#up-button')
    const rightBtn = document.querySelector('#right-button')
    const downBtn = document.querySelector('#down-button')

    var modeGravity = document.querySelector('#gravity-check') //
    var modeFour = document.querySelector('#four-check') //
    var modeMono = document.querySelector('#mono-check') //
    var modeRoblox = document.querySelector('#roblox-check') //
    var modeHomeo = document.querySelector('#homeo-check') // TODO
    var modeClearance = document.querySelector('#clearance-check') //
    var modeEyes = document.querySelector('#eyes-check') //
    var modeOpposite = document.querySelector('#opposite-check') //
    var modeGround = document.querySelector('#ground-check') //
    var modeProductive = document.querySelector('#productive-check') //
    var modeLava = document.querySelector('#lava-check') //
    var modeHard = document.querySelector('#hard-check') //
    var modeInteraction = document.querySelector('#interaction-check') //
    
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
    let musicState = false
    
    let timerId
    const speedDial = 6
    const speedTable = [80, 65, 50, 40, 32, 25, 20, 17, 15, 13]
    let timeStep = speedDial * speedTable[Math.min(level, speedTable.length-1)]
    let drop = 1
    let filledRows = []
    let toClear = []
    let bonus = 0
    const bonusTable = [0, 100, 400, 900, 2500]
    const levelTable = [10, 60, 90, 120, 150, 200, 250, 300, 350]

    let timerToutch
    const timeToogle = 600
    const timeReInput = 50

    const startPosition = 3
    let currentPosition = startPosition
    let currentRotation = 0
    const displayIndex = displayWidth*2+1

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
        color: '#6173ff',
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
        color: '#e23030',
        display:    [0, 1, displayWidth+1, displayWidth+2]
    }

    const monomino = {
        rotations: [[2],
                    [2],
                    [2],
                    [2]],
        color: '#903cf3',
        display:    [displayWidth+1]
    }

    const rowmino = {
        rotations: [Array.from(Array(width), (_, i) => i+width-startPosition),
                    Array.from(Array(width), (_, i) => i+width-startPosition),
                    Array.from(Array(width), (_, i) => i+width-startPosition),
                    Array.from(Array(width), (_, i) => i+width-startPosition)],
        color: '#ebddfc',
        display:    Array.from(Array(displayDepth), (_, i) => displayWidth*i-displayIndex+2)
    }

    const nomino = {
        rotations: [[], [], [], []],
        color: '#000000',
        display:    []
    }

    const theTetrominoes = [iTetromino, oTetromino, tTetromino, jTetromino, lTetromino, sTetromino, zTetromino, monomino, rowmino, nomino]
    const indexMonomino = [7]
    const indexRowmino = [8]
    const indexNomino = [9]
    const indexTetrominoes = Array.from(Array(7), (_, i) => i)

    function newRandom() {
        let indexValid = []
        if (modeFour.checked == true) {
            indexValid = indexValid.concat(indexTetrominoes)
        }
        if (modeMono.checked == true) {
            indexValid = indexValid.concat(indexMonomino)
        }
        if (modeRoblox.checked == true) {
            indexValid = indexValid.concat(indexRowmino)
        }
        if (indexValid.lenght == 0) {
            indexValid = indexValid.concat(indexNomino)
        }
        return indexValid[Math.floor(Math.random()*indexValid.length)]
    }

    let nextRandom = newRandom()
    let random = newRandom()
    let current = theTetrominoes[random]['rotations'][currentRotation]

    //Display

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = getColor(random)
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
            displaySquares[displayIndex + index].style.backgroundColor = getColor(nextRandom)
        })
    }

    function getColor(index) {
        if (modeEyes.checked == true) {
            return theTetrominoes[index]['color']
        } else {
            return ''
        }
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

    leftBtn.addEventListener('mousedown', () => {touch(moveLeft)})
    upBtn.addEventListener('mousedown', () => {touch(rotate)})
    rightBtn.addEventListener('mousedown', () => {touch(moveRight)})
    downBtn.addEventListener('mousedown', () => {touch(droping)})

    leftBtn.addEventListener('touchstart', () => {touch(moveLeft)})
    upBtn.addEventListener('touchstart', () => {touch(rotate)})
    rightBtn.addEventListener('touchstart', () => {touch(moveRight)})
    downBtn.addEventListener('touchstart', () => {touch(droping)})

    document.addEventListener('mouseup', () => {clearInterval(timerToutch)})

    document.addEventListener('touchend', () => {clearInterval(timerToutch)})

    function touch(inputFunction) {
        inputFunction()
        clearInterval(timerToutch)
        timerToutch = setInterval(reTouch(inputFunction), timeToogle)
    }

    function reTouch(inputFunction) {
        return function () {
            inputFunction()
            clearInterval(timerToutch)
            timerToutch = setInterval(inputFunction, timeReInput)
        }
    }

    function droping() {
        if (state==='play') {
            drop ++
            clearInterval(timerId)
            timerId = setInterval(gravity, timeStep)
            moveDown()
        }
    }

    function gravity() {
        if (modeHard.checked == true) {
            let time = 0
            while(state == 'play' && modeHard.checked == true && time < 1000) {
                time++
                console.log(time)
                if (modeGravity.checked == true) {
                    moveDown()
                }
            }
        } else if (modeGravity.checked == true) {
            moveDown()
        }
    }

    function moveOneDown(i) {
        if (squares[i].classList.contains('tetromino') && !squares[i + width].classList.contains('ground')) {
            if (squares[i].classList.contains('taken')) {
                if (!squares[i + width].classList.contains('taken') || !modeInteraction.checked) {
                    squares[i + width].classList.add('tetromino')
                    squares[i + width].classList.add('taken')
                    squares[i + width].style.backgroundColor = squares[i].style.backgroundColor
                    squares[i].classList.remove('tetromino')
                    squares[i].classList.remove('taken')
                    squares[i].style.backgroundColor = ''
                }
            }
        }
    }

    function moveDown() {
        if (state==='play') {
            if (modeGround.checked == false){
                const end = (depth-1) * width
                const endRow = Array.from(Array(width), (_, i) => i+end)
                sendToClear(endRow, end)
            }
            undraw()
            currentPosition += width
            if(superposition()) {
                currentPosition -= width
                draw()
                if (modeProductive.checked == true) {
                    location.replace("https://www.linkedin.com/jobs/")
                }
                if (modeLava.checked == true) {
                    gameOver()
                    return
                }
                freeze()
            } else {
                clear()
                draw()
            }
            if (modeHomeo.checked == false) {
                for (let i = width*(depth-1) -1 ; i > -1; i--) {
                    moveOneDown(i)
                }
            }
        }
    }

    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
      
      function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function superposition() {
        if (modeInteraction.checked) {
            return current.some(index => squares[currentPosition + index].classList.contains('taken'))
        } else {
            return current.some(index => squares[currentPosition + index].classList.contains('ground'))
        }
    }

    function moveLeft() {
        if (state==='play') {
            undraw()
            if(!isAtLeft()) currentPosition -=1
            if(superposition()) {
                currentPosition +=1
            }
            draw()
        }
    }

    function moveRight() {
        if (state==='play') {
            undraw()
            if(!isAtRight()) currentPosition +=1
            if (superposition()) {
                currentPosition -=1
            }
            draw()
        }
    }

    function rotate() {
        if (state==='play') {
            let tempPosition = currentPosition
            let tempRotation = currentRotation
            let currentTetromino = theTetrominoes[random]['rotations']
            undraw()
            currentRotation = (currentRotation+1) % currentTetromino.length
            right = isAtRight()
            left = isAtLeft()
            current = currentTetromino[currentRotation]
            if (right ^ left) {
                while(true) {
                    if (right) {
                        if (isAtLeft()) {
                            currentPosition -= 1
                        } else {
                            break
                        }
                    } else {
                        if (isAtRight()) {
                            currentPosition += 1
                        } else {
                            break
                        }
                    } 
                }
            }
            if (superposition()){
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

    musicBtn.addEventListener('click', () => {
        musicState = !musicState
        if (musicState) {
            music.play()
            musicBtn.style.backgroundColor = redColor
        } else {
            music.pause()
            musicBtn.style.backgroundColor = greenColor
        }
    })

    restartBtn.addEventListener('click', () => {restart()})

    startBtn.addEventListener('click', () => {
        if (state === 'pause') {
            state = 'play'
            grid.style.backgroundColor = '#00000080'
            startBtn.style.backgroundColor = greenColor
            draw()
            blinkState = false
            clearInterval(timerColor)
            timerId = setInterval(gravity, timeStep)
            displayShape()
        } else if (state === 'prestart' || state === 'over') {
            restart()
        } else if (state === 'play') {
            state = 'pause'
            grid.style.backgroundColor = '#6EFF6B80'
            timerColor = setInterval(blink(startBtn, greenLight, greenColor), timeBlink)
            clearInterval(timerId)
        }
    })

    function restart() {
        state = 'play'
        startBtn.style.backgroundColor = greenColor
        restartBtn.style.backgroundColor = redColor
        grid.style.backgroundColor = '#00000080'
        blinkState = false
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
        timeStep = speedDial * speedTable[Math.min(level, speedTable.length-1)]
        drop = 1
        filledRows = []
        toClear = []
        bonus = 0
        currentPosition = startPosition
        currentRotation = 0
        nextRandom = newRandom()
        random = newRandom()
        current = theTetrominoes[random]['rotations'][currentRotation]
        clearInterval(timerId)
        draw()
        timerId = setInterval(gravity, timeStep)
        displayShape()
    }

    function freeze() {
        clearInterval(timerId)
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        addScore()
        random = nextRandom
        current = theTetrominoes[random]['rotations'][currentRotation]
        nextRandom = newRandom()
        currentPosition = startPosition
        draw()
        displayShape()
        timerId = setInterval(gravity, timeStep)
        if(superposition()) {
            if (modeOpposite.checked == true) {
                let oppositeScore = 0
                squares.forEach(square => {
                    if (square.classList.contains('tetromino')) {
                        oppositeScore ++
                    }
                    square.classList.remove('tetromino')
                    square.classList.remove('taken')
                    square.style.backgroundColor = ''
                })
                rowCount += Math.floor(oppositeScore/width)
                rowDisplay.innerHTML = rowCount
                bonus += bonusTable[Math.min(oppositeScore, bonusTable.length-1)]
                for (let i = 0; i < width; i++) {
                    squares[width*depth +i].classList.add('taken');
                }
            } else {
                gameOver()
            }
        }
    }

    function sendToClear(row, i) {
        row.forEach(index => {
            if(squares[index].classList.contains('tetromino')) {
                squares[index].style.backgroundColor = '#ffffff'
            }
        })
        toClear.push([row, i])
    }
    
    function clear() {
        toClear.forEach(line => {
            line[0].forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(line[1], width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        })
        toClear = []
    }

    function addScore() {
        score += Math.min(drop * (1+level) * (level + depth-Math.floor(currentPosition/width)), 999)
        scoreDisplay.innerHTML = score
        drop = 1
        let bonusRow = 0
        for (let i = 0; i < width*depth; i +=width) {
            const row = Array.from(Array(width), (_, j) => j+i)
            if (row.every(index => squares[index].classList.contains('taken'))) {
                if (modeOpposite.checked == true) {
                    gameOver()
                    return
                }
                if (modeClearance.checked == true) {
                    if (filledRows.includes(i)) {
                        filledRows = filledRows.filter(item => item !== i)
                    } else {
                        rowCount ++
                        bonusRow ++
                        rowDisplay.innerHTML = rowCount
                    }
                    sendToClear(row, i)
                } else if (!filledRows.includes(i)) {
                    filledRows.push(i)
                    rowCount ++
                    bonusRow ++
                }
            }
        }
        bonus += bonusTable[Math.min(bonusRow, bonusTable.length-1)]
        if(modeClearance.checked == true && rowCount >= levelTreshold(level)) {
            level ++
            score += bonus
            levelDisplay.innerHTML = level
            scoreDisplay.innerHTML = score
            bonus = 0
            timerId = speedDial * speedTable[Math.min(level, speedTable.length-1)]
        }
        clear()
    }

    function levelTreshold(level) {
        let len = levelTable.length-1
        return levelTable[Math.min(level, len)] + (levelTable[len]-levelTable[len-1]) * Math.max(0, level - len)
    }

    function gameOver() {
        clearInterval(timerId)
        state = 'over'
        grid.style.backgroundColor = '#df000080'
        timerColor = setInterval(blink(restartBtn, redLight, redColor), timeBlink)
        if (modeClearance.checked == false) {
            score += bonus
            scoreDisplay.innerHTML = score
        }
    }

})



