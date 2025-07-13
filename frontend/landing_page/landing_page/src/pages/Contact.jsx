import React from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaChevronDown  } from 'react-icons/fa';

const Contact = () => {

    const faqItems = [
    { question: "What is the refund policy?", answer: "We offer a 30-day money-back guarantee on all our courses. If you're not satisfied, you can request a full refund within 30 days of purchase." },
    { question: "Can I access courses on my mobile device?", answer: "Absolutely! Our platform is fully responsive and works on all devices, including desktops, tablets, and smartphones, so you can learn anytime, anywhere." },
    { question: "Do I get a certificate after completing a course?", answer: "Yes, upon successful completion of any paid course, you will receive a verifiable certificate that you can add to your LinkedIn profile or resume." },
];

const FAQItem = ({ question, answer }) => (
    <details className="group border-b border-gray-200 py-4">
        <summary className="flex justify-between items-center font-semibold text-neutral-dark cursor-pointer list-none">
            {question}
            <FaChevronDown className="transform group-open:rotate-180 transition-transform duration-300" />
        </summary>
        <p className="text-gray-600 mt-3">{answer}</p>
    </details>
);

  return (
    // Set a background color that respects dark mode
    <div className="bg-white dark:bg-dark-bg min-h-[calc(100vh-150px)]">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          {/* Added dark:text-white to the heading */}
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Contact Us</h1>
          {/* Added dark:text-slate-400 to the paragraph */}
          <p className="mt-4 mb-12 text-lg text-slate-600 dark:text-slate-400">
            Have questions? We'd love to hear from you.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-primary-light dark:bg-dark-card p-8 rounded-lg shadow-lg">
          {/* Left Side: Contact Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input type="text" id="name" className="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
              <input type="email" id="email" className="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea id="message" rows="4" className="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus transition-colors">Send Message</button>
          </form>

          {/* Right Side: Contact Info */}
          <div className="space-y-6 text-slate-700 dark:text-slate-300">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Get in Touch</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Feel free to reach out through any of the methods below. We are available from 9am-5pm on weekdays.
            </p>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-primary text-xl" />
              <span>123 Learning Lane, Education City, 12345</span>
            </div>
            <div className="flex items-center gap-4">
              <FaPhone className="text-primary text-xl" />
              <span>(123) 456-7890</span>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-primary text-xl" />
              <span>contact@edtech.com</span>
            </div>
          </div>
        </div>

    {/* FAQ Section */}
                <section className="py-20 text-slate-700 dark:text-slate-300 dark:bg-dark-bg">
                    <div className="container mx-auto px-6 max-w-4xl text-slate-800 dark:text-white">
                        <h2 className="text-3xl font-bold text-slate-600 dark:text-slate-400 text-center mb-10">Frequently Asked Questions</h2>
                        <div className="bg-white p-8 rounded-xl shadow-lg text-slate-600 dark:text-slate-400">
                            {faqItems.map((item, index) => <FAQItem key={index} {...item} />)}
                        </div>
                    </div>
                </section>

      </div>
    </div>
  );
};

export default Contact;