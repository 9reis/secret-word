// CSS
import './App.css';
// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from "./data/words"

// Components 
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = () => {
    // Pick random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category);
    // Pick random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    console.log(word);

    // Retorna como obj, já que está sendo desestruturado como objeto(abaixo)
    return { word, category };
  }

  // Starts the secret word game  
  const startGame = () => {
    // Pick word and pick category
    // Desestrutura o retorno da função 
    const { word, category } = pickWordAndCategory();

    // Create an array of letters 
    // Retorna um array 
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // fill states 
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    // Primeiro deve estar tudo pronto, antes de iniciar o game;
    setGameStage(stages[1].name);
  };

  // Process the letter input 
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)) {
      // Retorna para evitar perder uma chance caso envie a letra novamentepointe
      return;
    }

    // push guessed letter or remove a guess 
    if (letters.includes(normalizedLetter)) {
      // Se a letra está correta 
      setGuessedLetters((actualGuessedLetters) => [
        // Adiciona a nova letra as letras que fazem parte da "palavra" 
        ...actualGuessedLetters,
        normalizedLetter
      ])
      // Se a letra está incorreta
    } else {
      // Add a nova letra a lista de letras erradas 
      // Spread operator -> pega todos os itens atuais e adiciona os novos. 
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  // Reseta os states
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // Monitora um dado, executa algo sempre que ele atualizar
  useEffect(() => {
    if (guesses <= 0) {
      // Reset all states 
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // Restarts the game  
  const retry = () => {
    // Zera o score e add 3 tentativas 
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game verifyLetter={verifyLetter}
        pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters}
        guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score} />}
      {gameStage === "end" && <GameOver retry={retry} />}
    </div>
  );
}

export default App;
