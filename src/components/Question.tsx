import React from 'react';

interface QuestionProps {
    questionNumber: Number,
    question: String,
}

function Question({questionNumber, question}:QuestionProps):JSX.Element {

    return (
      <div>
          <div>
              Question # {questionNumber}
          </div>
          <div>
              {question}
          </div>
      </div>
    );
  }
  
  export default Question;
  