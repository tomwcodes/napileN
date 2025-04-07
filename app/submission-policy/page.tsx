import React from 'react';

export default function SubmissionPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Submission Policy</h1>
      
      <div className="prose max-w-none">
        <p>Welcome to NapileN! We are excited to read your work. Please review the following guidelines before submitting.</p>

        <h2>General Guidelines</h2>
        <ul>
          <li>All submissions must be original work by the author.</li>
          <li>We accept submissions in Poetry, Fiction, and Articles categories.</li>
          <li>Simultaneous submissions are allowed, but please notify us immediately if your work is accepted elsewhere.</li>
          <li>Please proofread your work carefully before submitting.</li>
        </ul>

        <h2>Formatting</h2>
        <p>Please format your submissions as follows:</p>
        <ul>
          <li>Use a standard, readable font (e.g., Times New Roman, Arial) in 12pt size.</li>
          <li>Double-space fiction and articles. Single-space poetry, unless formatting is integral to the poem.</li>
          <li>Include your name and email address on the first page.</li>
        </ul>

        <h2>Rights</h2>
        <p>If your work is accepted, NapileN acquires First Electronic Rights. All rights revert to the author upon publication.</p>

        <h2>How to Submit</h2>
        <p>Please use the "Write" link in the navigation bar to access the submission form. Ensure you select the correct category for your work.</p>

        <h2>Response Time</h2>
        <p>We aim to respond to all submissions within 4-6 weeks. If you haven't heard back after 8 weeks, feel free to query.</p>

        <p>Thank you for considering NapileN for your creative work!</p>
      </div>
    </div>
  );
}
