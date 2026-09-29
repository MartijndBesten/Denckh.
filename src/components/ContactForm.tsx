"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  message: string;
  link: string;
};

const blankState: FormState = { name: "", email: "", message: "", link: "" };

export function ContactForm() {
  const [values, setValues] = useState<FormState>(blankState);
  const [message, setMessage] = useState("");

  function update(key: keyof FormState, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setMessage("Vul je naam, e-mailadres en idee in. Dan weet ik waar ik op kan reageren.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      setMessage("Dit e-mailadres lijkt nog niet helemaal te kloppen.");
      return;
    }
    setMessage("De verzendroute is nog niet gekoppeld. Dit formulier verstuurt nu niets.");
  }

  return (
    <form className="contact-form" noValidate onSubmit={validate}>
      <div className="form-grid">
        <label>
          Naam
          <input value={values.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" required />
        </label>
        <label>
          E-mail
          <input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" required />
        </label>
      </div>
      <label>
        Wat zit er in je hoofd?
        <textarea rows={5} value={values.message} onChange={(event) => update("message", event.target.value)} required />
      </label>
      <label>
        Heb je al iets om te laten zien? <span>(optioneel)</span>
        <input type="url" placeholder="Een link is genoeg" value={values.link} onChange={(event) => update("link", event.target.value)} />
      </label>
      <div className="form-bottom">
        <p>Ik gebruik je gegevens alleen om te reageren. Lees meer in de <Link href="/privacy/">privacyverklaring</Link>.</p>
        <button className="button button--dark" type="submit">Vertel het me</button>
      </div>
      <p className="form-status" role="status">{message}</p>
    </form>
  );
}
