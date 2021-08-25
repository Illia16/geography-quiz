import React, { useState, useEffect } from 'react';
import Question from './components/Question';
import QuestionTracker from './components/QuestionTracker';
import decodeString from './helpers/decodeString';

interface Data{
  answers: Array<string>,
  correctAnswer: String,
  question: String,
}

function App() {
  //game logic states
  const [currentQuestion, changeQuestion] = useState<number>(1);
  const [quizData, setQuizData] = useState<Array<Data>>([]);
  const [userAnswers, setUserAnswers] = useState<Array<string>>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [numOfCorrectAnswers, setNumOfCorrectAnswers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // main menu states
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('easy');

  // api error state
  const [errorApi, setErrorApi] = useState<boolean>(false);

  const startOver = ():void => {
    setGameOver(false);
    changeQuestion(1);
    setUserAnswers([]);
    setNumOfCorrectAnswers(0);
    fetchData();
    setGameStarted(false);
    setNumQuestions(5);
  }

  const fetchData = async () => {
    try {
      await fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=22&difficulty=${difficulty}`, {
        method: 'GET',
      })
      .then(res => res.json())
      .then((data) => {
        const newData: Array<Data>= [];

        data.results.forEach((q: any) => {
          newData.push({
            correctAnswer: q?.correct_answer,
            answers: [...q?.incorrect_answers, q?.correct_answer].sort().sort( () => .5 - Math.random() ),
            question: q?.question,
          })
        });
        setQuizData(newData);
        setLoading(false);
      })
    } catch (er) {
      console.error(er);
      setErrorApi(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (gameOver){
      for (let i = 0; i < quizData.length; i++) {
        if(quizData[i].correctAnswer===userAnswers[i]){
          setNumOfCorrectAnswers(prev => prev+1);
        }
      }
    }
  }, [gameOver]);

  const setAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allAnswers:Array<string> = userAnswers.slice();
    allAnswers[currentQuestion-1] = e.target.value;
    setUserAnswers(allAnswers)    
  }  

  useEffect(() => {
    if(gameStarted){
      setLoading(true);
      fetchData();
    }
  }, [gameStarted]);

  return (
    <div className="App">
      <header className="App-header">

        {!gameStarted ?
          <section>
            <h1>Georgaphy quiz.</h1>
            <p>Please, select a desired number of questions and difficulty.</p>
            <label>
              <select id="numQuestions" onChange={(e):void=>setNumQuestions(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </label>
            <label>
              <select id="difficulty" onChange={(e):void=>setDifficulty(e.target.value)}>
                <option value={'hard'}>Easy</option>
                <option value={'medium'}>Medium</option>
                <option value={'hard'}>Hard</option>
              </select>
            </label>
            <button className='start-game' onClick={()=>setGameStarted(true)}>Start</button>
          </section>
          : null
        }


        {gameStarted && quizData && quizData.length && !gameOver ?
        <div className='quiz'>
          <QuestionTracker 
            allQuestions={quizData.length}
            userAnswers={userAnswers}
          />
          <Question 
            questionNumber={currentQuestion} 
            question={quizData[currentQuestion-1].question} 
            answers={quizData[currentQuestion-1].answers}
            setAnswer={setAnswer}
            userAnswers={userAnswers}
          />
          <div className='next-prev-q-btns'>
            {currentQuestion >= 2 && <button onClick={()=>changeQuestion(currentQuestion-1)}>Previous Question</button>}
            {currentQuestion <= quizData.length-1 && <button onClick={()=>changeQuestion(currentQuestion+1)}>Next Question</button>}
            {userAnswers.length === quizData.length && !userAnswers.includes(undefined) ? <button onClick={()=>setGameOver(true)}>Finish</button> : null}
          </div>
        </div>
        : null
        }


        {loading && <div>Loading...</div>}

        {errorApi && 
          <div>
            <h2>Something went wrong. Please, try again later.</h2>
            <button onClick={()=>{setErrorApi(false); setGameStarted(false)}} className='start-over-btn'>Go back</button>
          </div>
        }


        {gameOver && 
          <div className='answers-container'>
            <div>
              You got {numOfCorrectAnswers} out of {quizData.length} correct!
            </div>
            <div>
              {quizData.map((q,i)=>
                <div key={`q-${i}`} className='answers'>
                  <div><span>Question:</span> {decodeString(q.question)}</div>
                  <div><span>Correct answer:</span> {decodeString(q.correctAnswer)}</div>
                  <div><span>User answer:</span> {decodeString(userAnswers[i])}</div>
                </div>
              )}
            </div>
            <button onClick={startOver} className='start-over-btn'>Start over</button>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
