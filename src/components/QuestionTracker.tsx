import React from 'react';

interface QuestionTrackerProps {
    allQuestions: Number,
    userAnswers: Array<string>,
}

function QuestionTracker({allQuestions, userAnswers}:QuestionTrackerProps):JSX.Element {
    const arr:Array<number> = new Array(allQuestions).fill().map((el,i)=>i);
    return (
      <div className='q-tracker'>
        {
          arr.map((el, i):any=>{
            return (
            <div className={userAnswers[i] ? 'asnwered' : 'notAnswered'}></div>
          )})
        }
      </div>
    );
  }
  
  export default QuestionTracker;
  