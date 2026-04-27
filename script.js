// ═══════════════════════════════════════════
//  Wait for the entire HTML to load first
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {


// ═══════════════════════════════════════════
//  1. CUSTOM CURSOR
//  We track mouse position and move two divs:
//  - cursor-dot   → follows instantly
//  - cursor-outline → follows with a slight lag
// ═══════════════════════════════════════════
const dot     = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

let mouseX = 0, mouseY = 0;       // actual mouse position
let outlineX = 0, outlineY = 0;   // outline's current position (lerped)

// Update mouse position on every move
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows instantly
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Outline follows smoothly using requestAnimationFrame
// This is called ~60 times per second by the browser
function animateOutline() {
  // Linear interpolation (lerp): move 12% of the distance each frame
  // This creates the smooth "lagging behind" effect
  outlineX += (mouseX - outlineX) * 0.12;
  outlineY += (mouseY - outlineY) * 0.12;

  outline.style.left = outlineX + 'px';
  outline.style.top  = outlineY + 'px';

  requestAnimationFrame(animateOutline); // loop forever
}
animateOutline();


// ═══════════════════════════════════════════
//  2. NAVBAR — glass effect on scroll
//  When user scrolls down 50px, add .scrolled
//  class which triggers the blur + border CSS
// ═══════════════════════════════════════════
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ═══════════════════════════════════════════
//  3. HAMBURGER MENU (mobile)
//  Toggles .open class on nav-links
//  which switches display:none to display:flex
// ═══════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Switch icon between ☰ and ✕
  hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.textContent = '☰';
  });
});


// ═══════════════════════════════════════════
//  4. TYPING ANIMATION
//  Cycles through an array of strings,
//  types them out letter by letter,
//  then deletes them — then repeats
// ═══════════════════════════════════════════
const typedEl = document.getElementById('typed-text');

// ✏️ CUSTOMIZE: add/change these to match your skills
const phrases = [
  'AI Models',
  'ML Pipelines',
  'Data Science',
  'Neural Networks',
  'Smart Solutions',
];

let phraseIndex = 0;   // which phrase we're on
let charIndex   = 0;   // which character within the phrase
let isDeleting  = false;

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    // Remove one character
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
  }

  // Typing speed:
  // - faster when deleting (80ms)
  // - normal when typing (120ms)
  // - long pause at end of word (1800ms)
  let speed = isDeleting ? 80 : 120;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Finished typing — pause then start deleting
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting — move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length; // loop back to 0
    speed = 400; // brief pause before typing next word
  }

  setTimeout(type, speed);
}

type(); // kick it off


// ═══════════════════════════════════════════
//  5. SCROLL REVEAL ANIMATION
//  Uses IntersectionObserver — a browser API
//  that fires a callback when an element
//  enters or leaves the viewport.
//
//  When a card enters view → add .visible
//  CSS then transitions opacity 0→1, Y 30→0
// ═══════════════════════════════════════════
const revealCards = document.querySelectorAll('.skill-card, .project-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is now visible in viewport
      entry.target.classList.add('visible');
      // Stop observing once revealed (no need to re-animate)
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,  // trigger when 15% of the card is visible
  rootMargin: '0px 0px -40px 0px' // trigger slightly before the bottom edge
});

// Attach observer to every card
revealCards.forEach(card => observer.observe(card));


// ═══════════════════════════════════════════
//  6. ACTIVE NAV LINK HIGHLIGHT
//  Tracks which section is in view and
//  highlights the matching nav link
// ═══════════════════════════════════════════
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active from all links
      navAnchors.forEach(a => a.style.color = '');

      // Find the matching nav link and highlight it
      const activeLink = document.querySelector(
        `.nav-links a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.style.color = '#00f5d4';
    }
  });
}, {
  threshold: 0.5 // section must be 50% visible to count as "active"
});

sections.forEach(s => sectionObserver.observe(s));


// ═══════════════════════════════════════════
//  7. CONTACT FORM
//  Intercepts submit, shows a success message
//  (Later you can connect this to EmailJS
//  or Formspree to actually send emails)
// ═══════════════════════════════════════════
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // stop page from refreshing

  const btn = contactForm.querySelector('button[type="submit"]');

  // Visual feedback
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate a short delay (like a real API call)
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#00f5d4';
    contactForm.reset(); // clear the form fields

    // Reset button after 3 seconds
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});


// ═══════════════════════════════════════════
//  8. SMOOTH STATS COUNT-UP ANIMATION
//  When the About section scrolls into view,
//  numbers count up from 0 to their value
// ═══════════════════════════════════════════
const statNums = document.querySelectorAll('.stat-num');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // Parse the number — e.g. "10+" → 10
      const target = parseInt(el.textContent);
      const suffix = el.textContent.replace(/[0-9]/g, ''); // keep "+" or "yrs"
      let current = 0;
      const step = target / 40; // finish in ~40 steps

      const counter = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(counter);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, 35); // runs every 35ms → ~1.4 seconds total

      countObserver.unobserve(el); // only animate once
    }
  });
}, { threshold: 0.5 });

statNums.forEach(n => countObserver.observe(n));

// AI chatbot
// ═══════════════════════════════════════════
//  AI CHATBOT — Powered by Gemini (Free)
// ═══════════════════════════════════════════

// ✏️ PASTE YOUR GEMINI API KEY HERE
const GEMINI_API_KEY = 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ✏️ CUSTOMIZE THIS with your real info
const SYSTEM_PROMPT = `You are a helpful assistant on Sakshyam Poudel's portfolio website.
Answer questions about Sakshyam in a friendly, professional tone.
Keep answers short — 2 to 3 sentences max.
Only answer questions related to Sakshyam or his work.
If asked something unrelated, politely redirect to his portfolio topics.

Here is everything you know about Sakshyam:
- Full name: Sakshyam Poudel
- Studying: Bachelor's in Computer Science & AI (CSAI)
- Location: Nepal
- Skills: Python, Machine Learning, Data Science, JavaScript, HTML, CSS
- Interests: AI, Neural Networks, NLP, Data Pipelines
- Projects: [ADD YOUR REAL PROJECTS HERE]
- Contact: [ADD YOUR EMAIL HERE]
- GitHub: https://github.com/Sakshyam-poudel
- Currently learning: Deep Learning, PyTorch, Data Science
- Goal: To build intelligent systems that solve real-world problems
- Available for: Internships, collaborations, academic projects`;

// Store conversation history
let chatHistory = [];

function toggleChat() {
  const widget = document.getElementById('chat-widget');
  const icon   = document.getElementById('chat-bubble-icon');
  widget.classList.toggle('chat-hidden');
  icon.textContent = widget.classList.contains('chat-hidden') ? '💬' : '✕';
}

function addMessage(text, type) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.classList.add('msg', type === 'user' ? 'user-msg' : 'bot-msg');
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function showTyping() {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.classList.add('msg', 'typing-msg');
  div.id = 'typing-indicator';
  div.textContent = '...';
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const userText = input.value.trim();
  if (!userText) return;

  // Show user message
  addMessage(userText, 'user');
  input.value = '';

  // Add to history
  chatHistory.push({
    role: 'user',
    parts: [{ text: userText }]
  });

  // Show typing
  showTyping();

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: chatHistory,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7
        }
      })
    });

    const data = await response.json();

    // Extract reply from Gemini response
    const botReply = data.candidates[0].content.parts[0].text;

    // Add to history
    chatHistory.push({
      role: 'model',
      parts: [{ text: botReply }]
    });

    removeTyping();
    addMessage(botReply, 'bot');

  } catch (error) {
    removeTyping();
    addMessage('Sorry, I had a small issue. Please try again!', 'bot');
    console.error(error);
  }
}


// ═══════════════════════════════════════════
//  Close the DOMContentLoaded wrapper
// ═══════════════════════════════════════════
});