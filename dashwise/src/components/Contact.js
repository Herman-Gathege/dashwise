import React, { useState } from "react";
import FAQ from "./FAQ";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email is invalid";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    alert("Thank you for contacting SmartBiz! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>
      <div className="contact-content-row">
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <label htmlFor="name">
            Name:
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              aria-describedby="nameError"
              required
            />
            {errors.name && <span className="error-msg" id="nameError">{errors.name}</span>}
          </label>

          <label htmlFor="email">
            Email:
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              aria-describedby="emailError"
              required
            />
            {errors.email && <span className="error-msg" id="emailError">{errors.email}</span>}
          </label>

          <label htmlFor="message">
            Message:
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              aria-describedby="messageError"
              required
            />
            {errors.message && <span className="error-msg" id="messageError">{errors.message}</span>}
          </label>

          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
        <div className="faq-container">
          <FAQ />
        </div>
      </div>
    </div>
  );
}

export default Contact;
