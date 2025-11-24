import React from 'react';
import './PageStyle.css';

const Privacy = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="privacy-page-bg">
      <div className="privacy-overlay">
        <div className="privacy-container">
          <h1 className="privacy-title">Privacy Notice</h1>
          <p className="intro-text">
            Welcome to <strong>BookNGo</strong>. This Privacy Notice explains how we collect, use, and protect your
            information when you use our website, mobile site, or apps. Please read carefully to
            understand our practices.
          </p>

          {/* Table of Contents */}
          <div className="toc">
            <h2>Contents</h2>
            <ul>
              <li onClick={() => scrollToSection('scope')}>1. Scope of This Notice</li>
              <li onClick={() => scrollToSection('information')}>2. Information We Collect</li>
              <li onClick={() => scrollToSection('use')}>3. How We Use Your Information</li>
              <li onClick={() => scrollToSection('sharing')}>4. Information Sharing and Disclosure</li>
              <li onClick={() => scrollToSection('security')}>5. Data Protection and Security</li>
              <li onClick={() => scrollToSection('rights')}>6. Your Choices and Rights</li>
              <li onClick={() => scrollToSection('updates')}>7. Updates to This Privacy Notice</li>
              <li onClick={() => scrollToSection('contact')}>8. Contact Us</li>
            </ul>
          </div>

          {/* Sections */}
          <section id="scope">
            <h2>1. Scope of This Notice</h2>
            <p>
              This Privacy Notice applies to all persons who purchase, intend to purchase, or inquire about
              any service offered by <strong>BookNGo</strong>. If you disagree with any part of this Notice,
              please refrain from using our services.
            </p>
          </section>

          <section id="information">
            <h2>2. Information We Collect</h2>
            <p>We collect personal and non-personal data including:</p>
            <ul>
              <li>Full name, contact number, email address, and location details.</li>
              <li>Travel preferences, booking details, and payment information.</li>
              <li>Login credentials and security-related information.</li>
              <li>Uploaded files (images, documents, etc.).</li>
              <li>Linked social media or publicly available data.</li>
            </ul>
            <p>
              Some information may be classified as “Sensitive Personal Data” under Indian law. By using our
              platform, you consent to our lawful use of such information.
            </p>
          </section>

          <section id="use">
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To complete bookings and process payments securely.</li>
              <li>To communicate confirmations, updates, and offers.</li>
              <li>To verify your account and prevent unauthorized access.</li>
              <li>To improve user experience and website functionality.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section id="sharing">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share your data with:</p>
            <ul>
              <li>Bus operators, hotels, and travel service providers.</li>
              <li>Payment processors and technology partners.</li>
              <li>Business affiliates and partners offering additional services.</li>
              <li>Entities involved in mergers, acquisitions, or restructuring.</li>
            </ul>
            <p>
              We ensure that data shared with third parties is used solely for fulfilling services and
              protected through appropriate agreements.
            </p>
          </section>

          <section id="security">
            <h2>5. Data Protection and Security</h2>
            <p>
              <strong>BookNGo</strong> uses advanced encryption, firewalls, and access controls to secure your
              personal data against unauthorized access or misuse. Sensitive payment data is encrypted during
              transmission and storage.
            </p>
          </section>

          <section id="rights">
            <h2>6. Your Choices and Rights</h2>
            <ul>
              <li>You can withdraw consent or update your information anytime.</li>
              <li>You may request correction or deletion of your personal data.</li>
              <li>You can disable certain data collection features in your profile settings.</li>
            </ul>
          </section>

          <section id="updates">
            <h2>7. Updates to This Privacy Notice</h2>
            <p>
              We may modify this Privacy Notice periodically. Updates will be posted on this page, and
              continued use of our services implies acceptance of the revised terms.
            </p>
          </section>

          <section id="contact">
            <h2>8. Contact Us</h2>
            <p>
              For any privacy-related queries or complaints, please reach out at{" "}
              <a href="mailto:support@bookngo.com" className="link">
                support@bookngo.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
