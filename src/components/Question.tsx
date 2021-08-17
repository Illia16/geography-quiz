import React from 'react';
import decodeString from '../helpers/decodeString'

interface QuestionProps {
    questionNumber: Number,
    question: String,
    answers: Array<string>,
    setAnswer: (e:React.ChangeEvent<HTMLInputElement>) => void,
    userAnswers: Array<string>
}

function Question({questionNumber, question, answers, setAnswer, userAnswers}:QuestionProps):JSX.Element {
    return (
      <div className='question'>
          <div>
              Question # {questionNumber}
          </div>
          <div>
            {decodeString(question)}
          </div>
          <div className='answer-btns'>
            {answers.map((q, i)=>(
                <label key={`option-${i}-${questionNumber}`}>
                    <input 
                      type="radio" 
                      name={`question-${questionNumber}`} 
                      value={q} 
                      onChange={setAnswer}
                      checked={q === userAnswers[questionNumber-1]}
                    /> 
                    <span>{decodeString(q)}</span>
                </label>
            ))
            }
          </div>
      </div>
    );
  }
  
  export default Question;
  