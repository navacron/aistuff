import React, { useState } from 'react';
import { FAQ } from '../data/config';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(i) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-inner">
        <h2 id="faq-heading" className="faq-title">
          Common Questions About Buying a Table Tennis Table
        </h2>
        <p className="faq-subtitle">
          Everything you need to know before you buy — answered by our experts.
        </p>
        <dl className="faq-list">
          {FAQ.map((item, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'faq-item--open' : ''}`}>
              <dt>
                <button
                  className="faq-question"
                  onClick={() => toggle(i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span>{item.question}</span>
                  <span className="faq-chevron">{openIndex === i ? '−' : '+'}</span>
                </button>
              </dt>
              <dd
                id={`faq-answer-${i}`}
                className="faq-answer"
                hidden={openIndex !== i}
              >
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
