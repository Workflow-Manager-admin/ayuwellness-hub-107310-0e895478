import React, { useState } from "react";

const whatsappNum = "919876543210"; // Demo number

// PUBLIC_INTERFACE
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="ayu-container" style={{maxWidth: 500}}>
      <h2>Contact & Consultation</h2>
      <p>
        For quick advice, message us directly:
        <a
          className="ayu-btn ayu-btn-whatsapp"
          href={`https://wa.me/${whatsappNum}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{marginLeft:10}}
        >💬 WhatsApp Us</a>
      </p>
      <h3>Or send us your question:</h3>
      {sent ? (
        <div className="ayu-success-msg">Thank you! We will get back to you soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="ayu-form">
          <label>
            Name
            <input type="text" name="name" required value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" required value={form.email} onChange={handleChange} />
          </label>
          <label>
            Message
            <textarea name="message" required value={form.message} onChange={handleChange} rows="4" />
          </label>
          <button className="ayu-btn ayu-btn-primary" type="submit">Send</button>
        </form>
      )}
    </section>
  );
}

export default Contact;
