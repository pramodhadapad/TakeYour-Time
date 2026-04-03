import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/shared/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Take Your Time
          </Link>
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: April 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-0">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Take Your Time ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Description of Service</h2>
            <p>
              Take Your Time is an online marketplace that connects students with qualified tutors for educational sessions. The Platform facilitates discovery, booking, payment, and scheduling of tutoring sessions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. User Accounts</h2>
            <p>
              You must create an account using Google Authentication to use our services. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to provide accurate, current, and complete information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Tutor Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Tutors must provide accurate information about their qualifications and experience.</li>
              <li>Tutors set their own availability and pricing.</li>
              <li>Tutors are responsible for honoring confirmed bookings.</li>
              <li>Tutors must comply with the cancellation policy as configured.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Student Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Students must attend booked sessions on time.</li>
              <li>Students must make payments through the Platform's approved methods.</li>
              <li>Students must provide respectful and constructive feedback.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Payments & Refunds</h2>
            <p>
              All payments are processed securely through Razorpay. The Platform charges a service fee on each transaction. Refund policies are subject to each tutor's cancellation policy, and refund requests will be processed within 5–7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Cancellation Policy</h2>
            <p>
              Each tutor configures their own cancellation window (default: 24 hours). Cancellations made within this window may not be eligible for a refund. The Platform reserves the right to mediate disputes between tutors and students.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Prohibited Conduct</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Using the Platform for any unlawful purpose.</li>
              <li>Sharing account credentials with third parties.</li>
              <li>Posting false, misleading, or defamatory content.</li>
              <li>Attempting to circumvent Platform fees by arranging payments outside the Platform.</li>
              <li>Engaging in harassment, discrimination, or abusive behavior.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Limitation of Liability</h2>
            <p>
              The Platform is provided "as is" without warranties of any kind. Take Your Time shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email. Continued use of the Platform after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">11. Contact</h2>
            <p>
              If you have questions about these Terms, contact us at <a href="mailto:support@takeyourtime.app" className="text-violet-600 hover:underline">support@takeyourtime.app</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
