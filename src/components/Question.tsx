import React from 'react';

interface QuestionProps {
    questionNumber: Number,
    question: String,
    answers: Array<string>,
    setAnswer: (e:any) => void,
}

function Question({questionNumber, question, answers, setAnswer}:QuestionProps):JSX.Element {    
    return (
      <div>
          <div>
              Question # {questionNumber}
          </div>
          <div>
            {question}
          </div>
          <div className='answer-btns'>
            {answers.map((q, i)=>(
                <label key={`option-${i}`}>
                    <input type="radio" name={`question-${questionNumber}`} value={q} onChange={setAnswer} /> 
                    <span>{q}</span>
                </label>
            ))
            }
          </div>
      </div>
    );
  }
  
  export default Question;
  