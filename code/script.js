const bearerToken = "K_j-rZJXREyooJ4mT2KP"

const restartContainer = document.querySelector("#restart-container")
const rightGuessesContainer = document.querySelector("#right-guesses")
const totalGuessesContainer = document.querySelector("#total-guesses")
const setupContainer = document.querySelector("#setup-container")
const quoteContainer = document.querySelector("#quote-container")
const guessContainer = document.querySelector("#guess-container")

const characters = [
    {
        name: "Frodo",
        id: "5cd99d4bde30eff6ebccfc15",
    },
    {
        name: "Sam",
        id: "5cd99d4bde30eff6ebccfd0d",
    },
    {
        name: "Pippin",
        id: "5cd99d4bde30eff6ebccfe2e",
    },
    {
        name: "Merry",
        id: "5cd99d4bde30eff6ebccfc7c",
    },
    {
        name: "Gandalf",
        id: "5cd99d4bde30eff6ebccfea0",
    },
    {
        name: "Boromir",
        id: "5cd99d4bde30eff6ebccfc57",
    },
    {
        name: "Aragorn",
        id: "5cd99d4bde30eff6ebccfbe6",
    },
    {
        name: "Legolas",
        id: "5cd99d4bde30eff6ebccfd81",
    },
    {
        name: "Gimli",
        id: "5cd99d4bde30eff6ebccfd23",
    }
]

let charactersInPlay = []
let secret, rightGuesses, totalGuesses
let quote, startButtonContainer

// this function dynamically creates all buttons for the setup
const createSetupButtons = () => {
    rightGuesses = 0
    totalGuesses = 0
    rightGuessesContainer.innerText = rightGuesses
    totalGuessesContainer.innerText = totalGuesses
    setupContainer.innerHTML = `
        <button id="frodoButton">Frodo</button>
        <button id="samButton">Sam</button>
        <button id="pippinButton">Pippin</button>
        <button id="merryButton">Merry</button>
        <button id="gandalfButton">Gandalf</button>
        <button id="boromirButton">Boromir</button>
        <button id="aragornButton">Aragorn</button>
        <button id="legolasButton">Legolas</button>
        <button id="gimliButton">Gimli</button>
        <button id="fellowshipButton" onclick="addAllCharacters()">The Fellowship</button>
        `
    quoteContainer.innerHTML = `
    <div class="outer-border">
        <div class="mid-border">
            <div class="inner-border">
                <img class="corner-decoration corner-left-top" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"></img>
                <img class="corner-decoration corner-right-top" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"></img>
                <img class="corner-decoration corner-right-bottom" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"></img>
                <img class="corner-decoration corner-left-bottom" src="https://i.ibb.co/4mKvK3N/corner-decoration.jpg"></img>
                <div class="actual-quote-container" id="actualQuoteContainer">
                    <p>Welcome to my "The Lord of the Rings - Guess the Quote" Game!<br>Choose two or more characters and start guessing.</p>
                </div>
                <div class="start-button-container" id="startButtonContainer">
                    <button id="startButton" onclick="startGame()">Start the game</button>
                </div>
            </div>
        </div>
    </div>
        `
    quote = document.querySelector("#actualQuoteContainer")
    startButtonContainer = document.querySelector("#startButtonContainer")
    for (let character of characters) {
        character.button = document.querySelector(`#${character.name.toLowerCase()}Button`)
        character.button.addEventListener("click", () => {
            charactersInPlay.push(character)
            character.button.disabled = true
        })
    }

}

createSetupButtons()

// this function does the following:
// 1. chooses a random character from the array of characters chosen by the user
// 2. requests all quotes by this character from the API
// 3. turns the response into json
// 4. filters the quotes so they have a min-length of 10
// 5. invokes addToHTML with a random quote from the filtered quotes, and removes whitespaces from the string
const getQuote = () => {
    secret = charactersInPlay[randomNum(charactersInPlay.length)]
    console.log(secret.name)
    fetch(`https://the-one-api.dev/v2/character/${secret.id}/quote`, { headers: { "Authorization": `Bearer ${bearerToken}` } })
        .then(response => response.json())
        .then(data => {
            const filteredQuotes = data.docs.filter((quote) => quote.dialog.length > 10)
            addToHTML(filteredQuotes[randomNum(filteredQuotes.length)].dialog.replace(/\s+/g, " "))
        })
}

// this generates a random number, where the interval depends on the maxNum param
const randomNum = (maxNum) => {
    return Math.floor(Math.random() * maxNum);
}

// this replaces the content of the container with a quote passed down by getData
const addToHTML = (quote) => {
    actualQuoteContainer.innerHTML = `
    <p>${quote}</p>
    `
}

// this resets the game by recreating the setup buttons, emptying the characters array, the HTML container, and enabling all buttons
const restart = () => {
    createSetupButtons()
    charactersInPlay = []
    startButtonContainer.innerHTML = `
    <button id="startButton" onclick="startGame()">Start the game</button>
    `
    guessContainer.innerHTML = ""
    const allButtons = document.querySelectorAll("button")
    for (let button of allButtons) {
        button.disabled = false
    }
}

// this adds all characters to characters in play, and disables the fellowship button
const addAllCharacters = () => {
    charactersInPlay = characters
    document.querySelector("#fellowshipButton").disabled = true
}

// this starts the game when the user has chosen at least two characters
const startGame = () => {
    if (charactersInPlay.length > 1) {
        setupContainer.innerHTML = ""
        startButtonContainer.innerHTML = ""
        getQuote()
        createGuessButtons()
    } else {
        actualQuoteContainer.innerHTML = `
        <p>You need to choose at least two characters to play.</p>
        `
    }
}

// this creates guess buttons for each character in play
const createGuessButtons = () => {
    guessContainer.innerHTML = ""
    for (let character of charactersInPlay) {
        guessContainer.innerHTML += `
            <button onclick="checkGuess('${character.name}')">${character.name}</button>
        `
    }
}

// this compares the user's guess to the right answer, updates the counter, and stops the game after 10 rounds
const checkGuess = (suspect) => {
    if (suspect === secret.name) {
        actualQuoteContainer.innerHTML = `
            <p>Correct! ${secret.name} was the right answer.</p>
        `
        rightGuesses++
    }
    else {
        actualQuoteContainer.innerHTML = `
            <p> Nope! ${secret.name} was the right answer.</p>
        `
    }
    totalGuesses++
    rightGuessesContainer.innerText = rightGuesses
    totalGuessesContainer.innerText = totalGuesses
    if (totalGuesses < 10) {
        guessContainer.innerHTML = `
        <button id="nextQuote" onclick="getQuote(), createGuessButtons()">Next Quote</button>
        `
    } else {
        guessContainer.innerHTML = ""
        actualQuoteContainer.innerHTML += `
        <p>
        You got ${rightGuesses} out of ${totalGuesses} right. Another round?
        </p>
        `
    }
}