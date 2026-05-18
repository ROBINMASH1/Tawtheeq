import { useState } from 'react';
import ScrollReveal from '../../componant/ScrollReveal';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const contacts = [
    {
      name: "Robin Almashhrawi",
      role: "Co-Founder & Software Engineer",
      email: "Robin@gmail.com",
      phone: "+962787748666",
      avatar: "R",
      color: "from-blue-400 to-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
    },
    {
      name: "Ibrahim Issa",
      role: "Co-Founder & Software Engineer",
      email: "ibrahemissa7@gmail.com",
      phone: "+962788105094",
      avatar: "I",
      color: "from-purple-400 to-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20">
      {/* Header Section */}
      <section className="relative px-8 py-20 overflow-hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-white to-white dark:from-green-900/20 dark:via-gray-800 dark:to-gray-800 -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <ScrollReveal direction="bottom" delay={0.1} y={25}>
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
              Get in touch
            </div>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={0.25} y={40}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              We'd love to hear from you
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={0.4} y={30}>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Whether you have a question about our blockchain infrastructure, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Information */}
          <div className="flex flex-col gap-12">
            <ScrollReveal direction="left" delay={0.1}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Direct Contacts</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Reach out to our leadership team directly for business inquiries, partnerships, or technical support.
                </p>
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-6">
              {contacts.map((contact, index) => (
                <ScrollReveal key={index} direction="left" delay={0.15 + index * 0.15} y={30}>
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:-translate-y-1 transition-transform">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br ${contact.color} shadow-lg shrink-0`}>
                      {contact.avatar}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{contact.name}</h3>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{contact.role}</span>
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors group">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${contact.bg} group-hover:scale-110 transition-transform`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </span>
                          {contact.email}
                        </a>
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors group">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${contact.bg} group-hover:scale-110 transition-transform`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </span>
                          <span dir="ltr">{contact.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal direction="left" delay={0.3} y={30}>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-8 border border-green-100 dark:border-green-800/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Our Office</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Amman, Jordan</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">Operating globally across decentralized networks.</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">Send a message</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 relative z-10">We'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:text-white transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:text-white transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:text-white transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className={`mt-2 w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                    submitted
                      ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25'
                      : 'bg-green-600 hover:bg-green-700 shadow-green-500/25 hover:-translate-y-0.5'
                  }`}
                >
                  {submitted ? 'Message Sent! ✨' : 'Send Message'}
                </button>
              </form>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </div>
  );
}
