import { useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";

const base = import.meta.env.BASE_URL;
// EmailJS IDs come from the build environment (.env.local locally, repository variables on GitHub);
// all three are public by design. Without them the form explains how else to get in touch.
const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
};
const canSend = !!(emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey);
const COOLDOWN_MS = 60_000;

type Note = { kind: "info" | "ok" | "error"; text: string };

export function Contact() {
  const [note, setNote] = useState<Note>({ kind: "info", text: canSend ? "Messages go straight to my inbox." : "The form isn't connected yet. Reach me on LinkedIn in the meantime." });
  const [sending, setSending] = useState(false);
  const lastSent = useRef(0);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const field = (name: string) => (f.elements.namedItem(name) as HTMLInputElement).value.trim();
    // spam bots fill in the hidden field; people never see it
    if (field("company")) return;
    const missing = [...f.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[required]")]
      .filter(x => !x.value.trim() || (x.type === "email" && !/^\S+@\S+\.\S+$/.test(x.value)));
    if (missing.length) {
      setNote({ kind: "error", text: "Add your " + missing.map(m => f.querySelector(`label[for="${m.id}"]`)!.textContent!.toLowerCase()).join(" and ") + " to send." });
      missing[0].focus();
      return;
    }
    if (!canSend) { setNote({ kind: "error", text: "The form isn't connected yet. Reach me on LinkedIn in the meantime." }); return; }
    if (Date.now() - lastSent.current < COOLDOWN_MS) { setNote({ kind: "error", text: "Thanks, that's already sent. You can send another in a minute." }); return; }

    setSending(true);
    setNote({ kind: "info", text: "Sending…" });
    try {
      await emailjs.send(emailjsConfig.serviceId!, emailjsConfig.templateId!, {
        from_name: field("cName"),
        from_email: field("cEmail"),
        topic: field("cTopic"),
        message: field("cMsg"),
        to_name: "Curtis",
        to_email: "mensah.curtis@gmail.com",
      }, { publicKey: emailjsConfig.publicKey! });
      lastSent.current = Date.now();
      setNote({ kind: "ok", text: `Thanks, ${field("cName").split(" ")[0]}. Your message is on its way and I'll reply to ${field("cEmail")}.` });
      f.reset();
    } catch (err) {
      console.error(err);
      setNote({ kind: "error", text: "That didn't send. Please try again, or message me on LinkedIn." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="block" id="contact">
      <div className="wrap contact">
        <div className="contact-copy">
          <span className="eyebrow">Contact</span>
          <h2>Have a project or a role in mind?</h2>
          <p>I'm open to frontend roles and interesting freelance work, especially anything with data visualisation or 3D on the web.</p>
          <div className="socials">
            <a className="btn btn-ghost" href="https://github.com/CurtisDAblorh" target="_blank" rel="noopener">GitHub</a>
            <a className="btn btn-ghost" href="https://www.linkedin.com/in/curtis-m-665989b2" target="_blank" rel="noopener">LinkedIn</a>
            <a className="btn btn-ghost" href={base + "cv/curtis-mensah-cv.pdf"} target="_blank" rel="noopener">CV (PDF)</a>
          </div>
        </div>
        <form id="contactForm" noValidate onSubmit={submit}>
          <div className="row2">
            <div className="field"><label htmlFor="cName">Name</label><input id="cName" name="cName" required placeholder="Joe Goldberg" autoComplete="name" /></div>
            <div className="field"><label htmlFor="cEmail">Email</label><input id="cEmail" name="cEmail" type="email" required placeholder="joe@company.com" autoComplete="email" /></div>
          </div>
          <div className="field"><label htmlFor="cTopic">What's it about?</label>
            <select id="cTopic" name="cTopic"><option>A full-time role</option><option>A freelance project</option><option>3D / character work</option><option>Just saying hi</option></select></div>
          <div className="field"><label htmlFor="cMsg">Message</label><textarea id="cMsg" name="cMsg" required placeholder="Tell me a bit about it…" /></div>
          {/* honeypot: hidden from people and screen readers */}
          <div className="hp" aria-hidden="true"><label htmlFor="cCompany">Company</label><input id="cCompany" name="company" tabIndex={-1} autoComplete="off" /></div>
          <button className="btn btn-primary" type="submit" disabled={sending} style={{ alignSelf: "flex-start" }}>{sending ? "Sending…" : "Send message"}</button>
          <p className={"form-note" + (note.kind === "ok" ? " ok" : note.kind === "error" ? " err" : "")} role="status">{note.text}</p>
        </form>
      </div>
    </section>
  );
}
