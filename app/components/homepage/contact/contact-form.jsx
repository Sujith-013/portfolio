"use client";
// @flow strict
import { isValidEmail } from "@/utils/check-email";
import axios from "axios";
import { useState } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

function ContactForm() {
  const [error, setError] = useState({ email: false, required: false });
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError({ ...error, required: false });
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({ ...error, required: true });
      return;
    } else if (error.email) {
      return;
    } else {
      setError({ ...error, required: false });
    };

    try {
      setIsLoading(true);
      // Relative on purpose: this always runs in the browser, on the same
      // origin as the API route, so it never needed an absolute URL built
      // from an env var. It used to be `${process.env.NEXT_PUBLIC_APP_URL}/api/contact`
      // — with that var unset (the default state, and true of every local/
      // preview environment unless someone remembers to set it), the
      // template literal baked in as the literal string "undefined/api/contact",
      // which the browser resolves relative to the current page — never
      // hitting the real route. Caught during redeploy prep because every
      // earlier verification pass POSTed to /api/contact directly, bypassing
      // this exact line.
      const res = await axios.post("/api/contact", userInput);

      toast.success("Message sent successfully!");
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      // error.response.data.message covers the honest 503 ("not configured
      // yet") and other API-reported failures. Anything else — a network
      // failure, a timeout, no response at all — has no message to read,
      // and toasting undefined renders a blank, silently-failed-looking
      // toast. Always show real text instead.
      toast.error(
        error?.response?.data?.message ||
        "Couldn't send that — check your connection and try again, or email me directly."
      );
    } finally {
      setIsLoading(false);
    };
  };

  // Same focus treatment as everywhere else the site previously stripped
  // outline with nothing to replace it (nav links, see navbar.jsx) — here
  // it's focus: rather than focus-visible: since a visible ring on mouse
  // click is normal, expected UX for form fields, not noise the way it
  // would be on a nav link.
  const inputCls =
    "bg-surface-raised w-full border rounded-md border-border-strong focus:border-accent outline-0 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 transition-all duration-300 px-3 py-2";

  return (
    <div>
      <h2 className="font-display font-medium mb-5 text-accent text-xl uppercase">Contact with me</h2>
      <div className="max-w-3xl text-text-primary rounded-lg border border-border-strong p-3 lg:p-5">
        <p className="text-sm text-text-secondary">{"If you have any questions or concerns, please don't hesitate to contact me. I am open to any work opportunities that align with my skills and interests."}</p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base" htmlFor="contact-name">Your Name: </label>
            <input
              id="contact-name"
              className={inputCls}
              type="text"
              maxLength="100"
              required={true}
              onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base" htmlFor="contact-email">Your Email: </label>
            <input
              id="contact-email"
              className={inputCls}
              type="email"
              maxLength="100"
              required={true}
              value={userInput.email}
              aria-invalid={error.email}
              aria-describedby={error.email ? "contact-email-error" : undefined}
              onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
              onBlur={() => {
                checkRequired();
                setError({ ...error, email: !isValidEmail(userInput.email) });
              }}
            />
            {error.email && <p id="contact-email-error" className="text-sm text-danger">Please provide a valid email!</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base" htmlFor="contact-message">Your Message: </label>
            <textarea
              id="contact-message"
              className={inputCls}
              maxLength="500"
              name="message"
              required={true}
              onChange={(e) => setUserInput({ ...userInput, message: e.target.value })}
              onBlur={checkRequired}
              rows="4"
              value={userInput.message}
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            {error.required && <p role="alert" className="text-sm text-danger">
              All fields are required!
            </p>}
            <button
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-accent px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-ink-950 no-underline transition-all duration-200 ease-out hover:bg-accent-hover hover:no-underline md:font-semibold"
              role="button"
              onClick={handleSendMail}
              disabled={isLoading}
            >
              {
                isLoading ?
                <span>Sending Message...</span>:
                <span className="flex items-center gap-1">
                  Send Message
                  <TbMailForward size={20} />
                </span>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;