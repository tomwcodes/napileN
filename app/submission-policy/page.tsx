import React from 'react';

export default function SubmissionPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center"> {/* Added text-center */}
      <h1 className="text-3xl font-semibold mb-8">Submission Policy</h1> {/* Increased margin */}
      
      {/* Removed prose, added inline-block and text-left for centered block */}
      <div className="inline-block text-left max-w-2xl space-y-6"> {/* Added max-width and spacing */}
        <p>Welcome to NapileN — we're excited to read your work! Before submitting, please review the following guidelines to help ensure a smooth and respectful publishing process.</p>

        <h2 className="text-2xl font-semibold pt-4">General Guidelines</h2> {/* Added padding-top */}
        <ul>
          <li>Submissions must be original work by the author.</li>
          <li>We currently accept work in the following categories: Poetry, Fiction, and Articles.</li>
          <li>Political content is not accepted. We aim to create a space focused on creativity, reflection, and artistic expression, free from partisan or political themes.</li>
          <li>Please proofread your work carefully before submitting.</li>
        </ul>

        <h2 className="text-2xl font-semibold pt-4">How to Submit</h2> {/* Added padding-top */}
        <p>To submit your work, use the “Write” link in the navigation bar. Please ensure you select the correct category for your submission.</p>

        <h2 className="text-2xl font-semibold pt-4">Response Time</h2> {/* Added padding-top */}
        <p>We aim to check and upload your submission within 48 hours.</p>

        <p className="pt-4">Thank you for considering NapileN as a home for your writing. We look forward to reading your work!</p> {/* Added padding-top */}
      </div>
    </div>
  );
}
