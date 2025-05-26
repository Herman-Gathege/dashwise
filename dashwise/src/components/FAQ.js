import React, { useState } from 'react';
import '../styles/FAQ.css';

const faqData = [
  {
    question: "What is DashWise?",
    answer: "DashWise is an all-in-one platform designed to help local service professionals manage appointments, income, and customers easily."
  },
  {
    question: "How do I sign up?",
    answer: "You can sign up directly through the DashWise website by clicking the Sign Up button and filling out the required information."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial so you can explore all the features before committing."
  },
  {
    question: "Can I manage multiple locations?",
    answer: "Yes, DashWise supports multiple locations and user roles within a single account."
  }
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">{item.question}</div>
            {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
