import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/shared/Footer';

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: April 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-0">1. Information We Collect</h2>
            <p>We collect the following information when you use Take Your Time:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and profile picture obtained through Google Authentication.</li>
              <li><strong>Profile Data:</strong> Subjects, bio, and availability (for tutors); booking history (for students).</li>
              <li><strong>Payment Data:</strong> Payment transactions are processed by Razorpay. We store order IDs and transaction references but never store your card details.</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, and session duration for improving our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain the Platform and its features.</li>
              <li>To process bookings and payments between students and tutors.</li>
              <li>To send transactional emails (booking confirmations, cancellation notices).</li>
              <li>To improve user experience and develop new features.</li>
              <li>To prevent fraud, abuse, and enforce our Terms of Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Payment processors:</strong> Razorpay, to facilitate secure transactions.</li>
              <li><strong>Email services:</strong> Resend, for transactional email delivery.</li>
              <li><strong>Analytics tools:</strong> Sentry, for error tracking and application stability.</li>
              <li><strong>Law enforcement:</strong> When required by law, subpoena, or court order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Data Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption, JWT-based authentication tokens, rate limiting, and HTTP security headers (via Helmet.js). However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Cookies & Local Storage</h2>
            <p>
              We use browser localStorage to store your authentication token for seamless login sessions. We do not use third-party advertising cookies. Essential cookies may be used for security and functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Update or correct inaccurate information.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
              <li><strong>Portability:</strong> Request a machine-readable copy of your data.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at <a href="mailto:privacy@takeyourtime.app" className="text-violet-600 hover:underline">privacy@takeyourtime.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide you with our services. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Children's Privacy</h2>
            <p>
              Take Your Time is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected data from a minor, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify registered users of material changes via email. Your continued use of the Platform constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Contact Us</h2>
            <p>
              For privacy-related inquiries, contact us at <a href="mailto:privacy@takeyourtime.app" className="text-violet-600 hover:underline">privacy@takeyourtime.app</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
