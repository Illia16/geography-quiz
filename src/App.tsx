import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Question from './components/Question';


function App() {
  const [currentQuestion, changeQuestion] = useState<number>(1);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Question questionNumber={1} question={'What is the capital of Great Britain?'}/>
        <p>{currentQuestion}</p>

        <div>
          <button onClick={()=>changeQuestion(currentQuestion-1)}>Previous Question</button>
          <button onClick={()=>changeQuestion(currentQuestion+1)}>Next Question</button>
        </div>
      </header>
    </div>
  );
}

export default App;
