class ChessPiece {
  constructor(svg, i, j, color) {
    this.svg = svg
    this.element = document.createElement('div')
    // this.element.innerHTML = this.svg
    this.element.classList.add('chess-piece')
    this.element.style.fontSize = '3em'
    // this.element.children[0].style.color = color
    this.chessPieceColor = color

    this.position = {}
    this.position.i = i
    this.position.j = j
  }
  getElement() {
    return this.element
  }
  translate(i, j) {
    this.element.style.translate = `${j * 5 + 1.2}rem ${i * 5 + 1.2}rem`
    this.position.i = i
    this.position.j = j
  }
  showAvaliablePositions() {
    throw new Error("Method 'showAvaliablePositions()' must be implemented.")
  }
}

class Rook extends ChessPiece {
  constructor(i, j, color) {
    let svg =
      '<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M32 192V48c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16V88c0 4.4 3.6 8 8 8h32c4.4 0 8-3.6 8-8V48c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16V88c0 4.4 3.6 8 8 8h32c4.4 0 8-3.6 8-8V48c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16V192c0 10.1-4.7 19.6-12.8 25.6L352 256l16 144H80L96 256 44.8 217.6C36.7 211.6 32 202.1 32 192zm176 96h32c8.8 0 16-7.2 16-16V224c0-17.7-14.3-32-32-32s-32 14.3-32 32v48c0 8.8 7.2 16 16 16zM22.6 473.4L64 432H384l41.4 41.4c4.2 4.2 6.6 10 6.6 16c0 12.5-10.1 22.6-22.6 22.6H38.6C26.1 512 16 501.9 16 489.4c0-6 2.4-11.8 6.6-16z"/></svg>'
    super(svg, i, j, color)
    this.element.classList.add('fa-solid', 'fa-chess-rook')
    this.element.style.color = color

    // this.element.style.translate = `${x}em ${y}em`
    this.translate(i, j)
  }
  showAvaliablePositions(chessBoard) {
    for (let i = 0; i < 8; i++) {
      if (this.position.i !== i) {
        chessBoard.elementGrid[i][this.position.j].classList.add('highlight')
      }
      if (this.position.j !== i) {
        chessBoard.elementGrid[this.position.i][i].classList.add('highlight')
      }
    }
  }
  removeAvaliablePositions(chessBoard) {
    for (let i = 0; i < 8; i++) {
      if (this.position.i !== i) {
        chessBoard.elementGrid[i][this.position.j].classList.remove('highlight')
      }
      if (this.position.j !== i) {
        chessBoard.elementGrid[this.position.i][i].classList.remove('highlight')
      }
    }
  }

  // throw new Error("Method 'showAvaliablePositions()' must be implemented.")
}

function onClickGrid(e) {
  let i = Math.floor(parseInt(e.target.dataset.gridId) / 8)
  let j = Math.floor(parseInt(e.target.dataset.gridId) % 8)
  console.log(i + ' ' + j)

  if (chessBoard.selected === null) {
    chessBoard.selected = chessBoard.piece2dPosi[i][j]
    // console.log(chessBoard.selected)
    chessBoard.selected.showAvaliablePositions(chessBoard)
  } else {
    if (chessBoard.piece2dPosi[i][j] !== null) {
      chessBoard.selected = chessBoard.piece2dPosi[i][j]
      chessBoard.selected.showAvaliablePositions(chessBoard)
      return
    }
    chessBoard.piece2dPosi[chessBoard.selected.position.i][chessBoard.selected.position.j] = null
    console.log(chessBoard.elementGrid[i][j].classList)

    if (chessBoard.elementGrid[i][j].classList.contains('highlight')) {
      console.log('true position')
      chessBoard.selected.removeAvaliablePositions(chessBoard)
      chessBoard.selected?.translate(i, j)
    } else {
      console.log('Wrong position')
      return
    }

    chessBoard.piece2dPosi[i][j] = chessBoard.selected
    chessBoard.selected = null
  }
}

class ChessBoard {
  constructor() {
    this.piece2dPosi = []
    for (let ind = 0; ind < 8; ind++) {
      this.piece2dPosi.push([null, null, null, null, null, null, null, null])
    }

    this.selected = null
    this.elementGrid = []

    let temp = []
    for (let index = 0; index < 64; index++) {
      const elem = document.createElement('div')
      elem.dataset.gridId = `${index}`
      elem.onclick = onClickGrid
      temp.push(elem)
      if (index % 8 === 7) {
        this.elementGrid.push(temp)
        temp = []
      }
    }
  }

  addCheckerColor(parent) {
    let k = 0
    let i = 0
    let flip = 0

    while (i < 64) {
      while (flip === 0) {
        const element = parent.children[i]
        if (i % 2 === 0) {
          element.classList.add('checker-color')
        } else {
          element.classList.add('newchecker-color')
        }
        k++

        if (i % 8 === 7) {
          flip = 1
          k = 0
        }
        i++
      }
      while (flip == 1) {
        const element = parent.children[i]

        if (i % 2 != 0) {
          element.classList.add('checker-color')
        } else {
          element.classList.add('newchecker-color')
        }
        k++

        if (i % 8 === 7) {
          flip = 0
          k = 0
        }
        i++
      }
    }
  }

  addChildrenToParent(parent) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        parent.appendChild(this.elementGrid[i][j])
      }
    }
  }

  addChessPieces(chessPieceContainer) {
    for (let i = 0; i < 8; i++) {
      this.piece2dPosi[7][i] = new Rook(7, i, 'green')
      chessPieceContainer.appendChild(chessBoard.piece2dPosi[7][i].element)
    }
  }
}

const parent = document.getElementsByClassName('grid-container')[0]
const COLOR_1 = '#e9eccd'
const gridParent = document.getElementsByClassName('piece-container')[0]
const chessPieceContainer = document.getElementsByClassName('chess-piece-container')[0]
// chessPieceContainer.appendChild(new Rook(1, 5, 'red').element)

const chessBoard = new ChessBoard()

chessBoard.addChildrenToParent(parent)
chessBoard.addCheckerColor(parent)
chessBoard.addChessPieces(chessPieceContainer)
