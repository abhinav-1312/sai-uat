import React from 'react'
import faqData from './faqData.json';

const Faq = () => {
  return (
    <div className="faq-container">
      {faqData.map(({ id, question, answer }) => (
        <div key={id} className="faq-item">
          <h3 className="faq-question">{id}: {question}</h3>
          <div className="faq-answer">
            <strong>Answer: </strong>
            {Array.isArray(answer) ? (
              <ul>
                {answer.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{answer}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Faq
