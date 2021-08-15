import React, { useState, useEffect } from 'react';
import Question from './components/Question';
import decodeString from './helpers/decodeString';

interface Data{
  answers: Array<string>,
  correctAnswer: String,
  question: String,
}

function App() {
  const [currentQuestion, changeQuestion] = useState<number>(1);
  const [quizData, setQuizData] = useState<Array<Data>>([]);
  const [userAnswers, setUserAnswers] = useState<Array<string>>([]);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [numOfCorrectAnswers, setNumOfCorrectAnswers] = useState<number>(0);

  const startOver = ():void => {
    setGameOver(false);
    changeQuestion(1);
    setUserAnswers([]);
    setNumOfCorrectAnswers(0);
    fetchData();
  }

  const fetchData = async () => {
    try {
      await fetch("https://opentdb.com/api.php?amount=15&category=22&difficulty=easy", {
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
        setQuizData(newData)
      })
    } catch (er) {
      console.error(er);
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
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {quizData && quizData.length && !gameOver ?
        <div className='quiz'>
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
        : gameOver ? null : <div>Loading...</div>
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
