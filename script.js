window.addEventListener("load", main);

const listWords = [
    'SAPO', 'AVIÃO', 'TELEFONE', 'DOENÇA', 'NARIZ', 'FORMIGA', 'CRUZ', 'SEMÁFARO',
    'BASQUETE', 'DESENHO', 'ACADEMIA', 'ELEFANTE', 'ALMOÇO', 'TIGRE', 'CINZA'
];
const colors = ['navy','darksalmon', 'purple', 'black', 'red', 'lime', 'teal', 'deeppink','mediumvioletred'];
const titleGame = window.document.getElementById('title-game');
const divResultGame = window.document.getElementById('result-game')
const divWord = window.document.getElementById('sorted-word')
const divResultWord = window.document.getElementById('input-word')
const textScore = window.document.getElementById('score-text')
let score = 0;
divResultWord.style.width = 'auto'
divResultWord.style.height = 'auto'
let randomWord = handleWord(listWords)

function main() {
    paintTitle()
    const shuffledWord = shuffleWord(randomWord);
    handleDrag(shuffledWord, divWord);
    resultWord(randomWord, divResultWord);
}

function paintTitle() {
    titleGame.innerHTML = ''
    const text = 'Jogo-de-Desembaralhar'
    for (let i = 0; i < text.length; i++) {
        const posIndex = Math.floor(Math.random() * (colors.length - 1));
        const tagText = `<span style="color:${colors[posIndex]}; font-size: 50px; text-shadow: 2px 2px 4px #000000;">${text[i]}</span>`;
        titleGame.innerHTML += tagText;
    }
}

function handleWord(list) {
    const randomPosition = Math.floor(Math.random() * list.length);
    return listWords[randomPosition]
}

function shuffleWord(word) {
    let arrayWord = Array.from(word);
    for (let i = arrayWord.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayWord[i], arrayWord[j]] = [arrayWord[j], arrayWord[i]];
    }
    return arrayWord.join('');
}

function handleDrag(alteredWord, container) {
    for (let i = 0; i < alteredWord.length; i++) {
        let letterWord = document.createElement('p');
        letterWord.id = `p${i+1}`;
        letterWord.draggable = true;
        letterWord.style.fontSize = '30px';
        letterWord.ondragstart = drag;
        letterWord.textContent = alteredWord[i];
        container.appendChild(letterWord);
    }
}

function resultWord(word, container) {
    for (let i = 0; i < word.length; i++) {
        let squareWord = document.createElement('div');
        squareWord.classList.add('divs');
        squareWord.id = `div${i+1}`;
        squareWord.ondrop = drop;
        squareWord.ondragover = allowDrop;
        squareWord.style.border = '1px solid black';
        squareWord.style.width = '45px';
        squareWord.style.height = '45px';
        squareWord.style.display = 'inline-block';
        squareWord.style.textAlign = 'center';
        squareWord.style.lineHeight = '45px';
        container.appendChild(squareWord);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    if (ev.target.tagName === 'DIV' && ev.target.children.length === 0) {
        const letter = document.getElementById(data);
        ev.target.appendChild(letter);
        letter.style.margin = '0';
        checkSquares();
    }
}

function checkSquares() {
    const allSquares = document.querySelectorAll('.divs')
    let allIsFilled = true

    allSquares.forEach((square) =>{
        if (square.children.length === 0) { allIsFilled = false }
    })
    if (allIsFilled) {
        checkResult()
    }
}

function checkResult() {
    const allSquares = document.querySelectorAll('.divs')
    const buttonReset = document.createElement('button')
    const textResult = document.createElement('p')
    textResult.style.fontSize = '25px';
    buttonReset.id = 'button-reset'

    let joinLettersForSquare = ''
    allSquares.forEach((square) =>{
        joinLettersForSquare += square.children[0].innerText
    })
    if (randomWord === joinLettersForSquare) {
        textResult.innerText = 'Parabéns, você acertou!'
        divResultGame.appendChild(textResult)
        score++
        textScore.innerText = score
        textResult.style.color = 'lime'
    } else {
        textResult.innerText = 'Falhou, tente novamente!'
        divResultGame.appendChild(textResult)
        score--
        textScore.innerText = score
        textResult.style.color = '#ff0000'
    }
    buttonReset.innerText = 'Jogar Novamente'
    divResultGame.appendChild(buttonReset)
    buttonReset.addEventListener("click", resetGame)
}

function resetGame() {
    randomWord = handleWord(listWords)
    if (divResultWord.children.length !== 0) {
        divResultWord.innerHTML = ""
        divResultGame.innerHTML = ""
    }
    main()
}