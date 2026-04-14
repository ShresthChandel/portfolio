import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID || "service_id",
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID || "template_id",
        {
          from_name: form.name,
          to_name: "Me",
          from_email: form.email,
          to_email: "myemail@example.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY || "public_key"
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <section className="c-space my-20" id="contact">
      <div className="relative min-h-screen flex items-center justify-center flex-col">
        <img src="/assets/terminal.png" alt="terminal-bg" className="absolute inset-0 min-h-screen w-full object-cover sm:object-fill" />

        <div className="contact-container">
          <h3 className="head-text">Let's talk</h3>
          <p className="text-lg text-secondary mt-3">
            Whether you’re looking to build a new website, improve your existing platform, or bring a unique project to life, I’m here to help.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='mt-12 flex flex-col space-y-7'
          >
            <label className='space-y-3 block'>
              <span className='field-label'>Full Name</span>
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
                required
                placeholder="ex., John Doe"
                className='field-input'
              />
            </label>
            <label className='space-y-3 block'>
              <span className='field-label'>Email address</span>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                required
                placeholder="ex., johndoe@gmail.com"
                className='field-input'
              />
            </label>
            <label className='space-y-3 block'>
              <span className='field-label'>Your message</span>
              <textarea
                name='message'
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder='Share your thoughts or inquiries...'
                className='field-input'
              />
            </label>

            <button
              type='submit'
              className='field-btn'
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
              <img src="/assets/arrow-up.png" alt="arrow-up" className="field-btn_arrow" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
