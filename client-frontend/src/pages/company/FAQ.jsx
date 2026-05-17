import { useState } from 'react';

const faqs = [
  {
    question: "What is Tawtheeq?",
    answer: "Tawtheeq is a decentralized platform built on Hyperledger Fabric that allows academic institutions to issue, manage, and verify educational credentials securely. It eliminates academic fraud by storing cryptographically hashed records on the blockchain."
  },
  {
    question: "How do I verify a certificate?",
    answer: "You can instantly verify any certificate by visiting the Verify Credentials page and entering the unique certificate ID. The system will query the blockchain and return the authenticity status in milliseconds."
  },
  {
    question: "What is Chaincode?",
    answer: "Chaincode is the Hyperledger Fabric equivalent of a smart contract. It contains the business logic that governs how credentials are issued, transferred, and revoked, ensuring all operations are automatically executed according to agreed-upon rules."
  },
  {
    question: "Is my personal data stored on the blockchain?",
    answer: "No. The blockchain only stores a cryptographic hash (a digital fingerprint) of your credential. The actual document and personal data are encrypted and stored off-chain (e.g., via IPFS), ensuring full compliance with data privacy regulations."
  },
  {
    question: "What happens if I lose access to my account?",
    answer: "Your credentials remain safe on the blockchain. You can regain access to your student dashboard through our secure OTP-based password recovery process using your registered email address or phone number."
  },
  {
    question: "Can an institution revoke a certificate?",
    answer: "Yes. Authorized university administrators have the ability to revoke a certificate through a chaincode transaction. Once revoked, the blockchain record is updated, and any future verification attempts will instantly flag the certificate as invalid."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative px-8 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-900 -z-10" />
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-teal-200 dark:border-teal-800">
            Help Center
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">Questions</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Everything you need to know about the product and how it works. Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="px-8 py-16 pb-32">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index 
                  ? 'bg-white dark:bg-gray-800 shadow-md ring-1 ring-teal-500/20' 
                  : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-500 transition-transform duration-300 shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Support CTA */}
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-teal-600 dark:bg-teal-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative z-10 flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-teal-100">Our team is ready to help you with any issues.</p>
          </div>
          <div className="relative z-10">
            <a href="/contact" className="inline-block px-8 py-4 bg-white text-teal-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
