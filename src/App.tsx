import React, { useState, useEffect } from 'react';
import './App.css';
import Question from './components/Question';

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
      await fetch("https://opentdb.com/api.php?amount=5&category=22&difficulty=easy", {
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

  // useEffect(() => {
  //   console.log('userAnswers',userAnswers);
  //   console.log('quizData',quizData);
  // }, [quizData, userAnswers]);

  useEffect(() => {
    if (gameOver){
      for (let i = 0; i < quizData.length; i++) {
        if(quizData[i].correctAnswer===userAnswers[i]){
          setNumOfCorrectAnswers(prev => prev+1);
        }
      }
    }
  }, [gameOver]);

  const setAnswer = (e: any) => {
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
        <div>
          <Question 
            questionNumber={currentQuestion} 
            question={quizData[currentQuestion-1].question} 
            answers={quizData[currentQuestion-1].answers}
            setAnswer={setAnswer}
          />
          <div>
            -----------------------
          </div>
          <div className='next-prev-q-btns'>
            {currentQuestion >= 2 && <button onClick={()=>changeQuestion(currentQuestion-1)}>Previous Question</button>}
            {currentQuestion <= quizData.length-1 && <button onClick={()=>changeQuestion(currentQuestion+1)}>Next Question</button>}
            {userAnswers.length === quizData.length && <button onClick={()=>setGameOver(true)}>Finish</button>}
          </div>
        </div>
        : gameOver ? null : <div>Loading...</div>
        }

        {gameOver && 
          <div>
            <div>
              You got {numOfCorrectAnswers} out of {quizData.length} correct!
            </div>
            <div>
              {quizData.map((q,i)=>
                <div key={`q-${i}`} className='answers'>
                  <div>Question:{q.question}</div>
                  <div>Correct answer:{q.correctAnswer}</div>
                  <div>User answer: {userAnswers[i]}</div>
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
