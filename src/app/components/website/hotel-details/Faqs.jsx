import React, { useState } from 'react';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'What are the check-in and check-out times at Hilton Istanbul Bomonti Hotel & Conference Center?',
      answer: 'The check-in time at Hilton Istanbul Bomonti Hotel & Conference Center is 15:00 and the check-out time is 12:00.',
    },
    { id: 2, question: 'What is your design process?', answer: '' },
    { id: 3, question: 'In publishing and graphic design, Lorem', answer: '' },
    { id: 4, question: 'In publishing and graphic design, Lorem', answer: '' },
    { id: 5, question: 'In publishing and graphic design, Lorem', answer: '' },
    { id: 6, question: 'In publishing and graphic design, Lorem', answer: '' },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={` rounded-lg ${
              activeIndex === index ? 'bg-orange text-white' : 'bg-[#F5F8FF]'
            }`}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center space-x-4">
                <span className="font-bold text-lg">{faq.id.toString().padStart(2, '0')}</span>
                <span className="font-medium">{faq.question}</span>
              </div>
              <button
                className={`transition-transform ${
                  activeIndex === index ? 'bg-white  rotate-45' : 'bg-[#F1F1F1]'
                } text-xl rounded-2xl p-2`} 
              >
                +
              </button>
            </div>
            {activeIndex === index && (
              <div className="p-4 text-sm border-t border-gray-200">
                {faq.answer || 'Content not available.'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
