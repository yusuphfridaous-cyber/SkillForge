const HTML_PROGRESS_KEY = 'html-progress-state-v1';
const USERS_KEY = 'skillforge-users';
const CURRENT_USER_KEY = 'skillforge-current-user';

const levelNames = ['Beginner', 'Beginner +', 'Intermediate', 'Intermediate +', 'Advanced'];
const LEVEL_STEP_XP = 200;
const XP_PER_SUCCESS = 50;
const XP_PER_FAILURE = 25;
const XP_FAIL_STREAK_PENALTY = 10;
const xpThresholds = Array.from({ length: levelNames.length }, (_, index) => index * LEVEL_STEP_XP);
const DEFAULT_WORKSPACE_PATH = 'C:/Users/USER/Desktop/SkillForge';

const firebaseConfig = {
    apiKey: 'AIzaSyDt-OCQ2Tr4O4no1O_AmBzlVbFz9O3EwIU',
    authDomain: 'skill-forge-academy.firebaseapp.com',
    projectId: 'skill-forge-academy',
    storageBucket: 'skill-forge-academy.firebasestorage.app',
    messagingSenderId: '1081814181931',
    appId: '1:1081814181931:web:fc1c99304337caeb18626e'
};

let firebaseAuth = null;
let firebaseReady = false;

function initFirebaseAuth() {
    if (!window.firebase || !firebase) {
        return;
    }

    const hasPlaceholderValues = Object.values(firebaseConfig).some((value) => {
        return typeof value === 'string' && value.startsWith('YOUR_');
    });

    if (hasPlaceholderValues) {
        console.info('Firebase config is not active yet. Google sign-in will not run until the keys are replaced.');
        return;
    }

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebaseAuth = firebase.auth();
        firebaseReady = true;
    } catch (error) {
        console.error('Firebase Auth initialization failed:', error);
        return;
    }

    firebaseAuth.onAuthStateChanged((user) => {
        if (!user) {
            return;
        }

        const googleUser = normalizeUser({
            name: user.displayName || 'Google User',
            email: user.email,
            password: 'google-auth',
            xp: 0,
            htmlTasks: 0,
            cssTests: 0,
            bestScore: 0,
            cssBestScore: 0,
            failedStreak: 0
        });

        const existingUser = users.find((account) => account.email.toLowerCase() === googleUser.email.toLowerCase());
        if (!existingUser) {
            users.push(googleUser);
            saveUsers();
        } else {
            Object.assign(existingUser, googleUser);
            saveUsers();
        }

        setCurrentUser(googleUser.email);
    });
}

const htmlProjectBank = [
    {
        level: 0,
        title: 'Personal Bio Page',
        description: 'Create a simple profile page with your name, short bio, image, and a few links.',
        tasks: [
            'Use a heading for your name.',
            'Add a short paragraph about yourself.',
            'Insert an image and a link to your social profile.',
            'Use at least one list and one paragraph.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Bio</title>
  </head>
  <body>
    <h1>Jane Doe</h1>
    <img src="profile.jpg" alt="Jane Doe" width="200" />
    <p>I am a beginner web developer who enjoys learning HTML and CSS.</p>
    <h2>Skills</h2>
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
    <a href="https://github.com/yourname">GitHub</a>
  </body>
</html>`
    },
    {
        level: 0,
        title: 'School Landing Page',
        description: 'Make a one-page school website with a hero section, courses, and contact details.',
        tasks: [
            'Add a main heading and supporting text.',
            'Create a navigation bar.',
            'Add course cards using lists or divs.',
            'Include a contact section.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>School Landing Page</title>
  </head>
  <body>
    <nav>
      <a href="#home">Home</a>
      <a href="#courses">Courses</a>
      <a href="#contact">Contact</a>
    </nav>
    <h1>Welcome to Bright Academy</h1>
    <p>Learn skills that prepare you for the future.</p>
    <h2>Courses</h2>
    <ul>
      <li>Web Design</li>
      <li>Computer Science</li>
      <li>Graphic Design</li>
    </ul>
    <h2>Contact</h2>
    <p>Email: info@brightacademy.com</p>
  </body>
</html>`
    },
    {
        level: 0,
        title: 'Favorite Food Blog Card',
        description: 'Create a mini blog card with a title, recipe summary, ingredients, and a call to action.',
        tasks: [
            'Use proper headings and paragraph text.',
            'Add an ingredients list.',
            'Include a button-like link.',
            'Keep the content clean and readable.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Favorite Food</title>
  </head>
  <body>
    <h1>Easy Pasta Recipe</h1>
    <p>A quick and delicious meal for busy afternoons.</p>
    <h2>Ingredients</h2>
    <ul>
      <li>Pasta</li>
      <li>Tomato sauce</li>
      <li>Garlic</li>
      <li>Parmesan</li>
    </ul>
    <a href="#recipe">View Recipe</a>
  </body>
</html>`
    },
    {
        level: 1,
        title: 'Portfolio Homepage',
        description: 'Build a mini portfolio homepage with a header, about section, work examples, and contact section.',
        tasks: [
            'Add a logo or brand name.',
            'Use semantic tags like header, main, and footer.',
            'Create sections for about, projects, and contact.',
            'Add navigation links to each section.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Portfolio</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <section id="about">
        <h1>Hi, I am Alex</h1>
        <p>I design and build websites.</p>
      </section>
      <section id="projects">
        <h2>Projects</h2>
        <p>Portfolio site, coffee shop page, and blog layout.</p>
      </section>
    </main>
    <footer id="contact">
      <p>Email: alex@example.com</p>
    </footer>
  </body>
</html>`
    },
    {
        level: 1,
        title: 'Restaurant Landing Page',
        description: 'Create a restaurant home page with a hero, menu highlights, and reservation section.',
        tasks: [
            'Set up an attractive hero section.',
            'List popular meals or categories.',
            'Add a reservation button or contact text.',
            'Use semantic structure for readability.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FreshBite Restaurant</title>
  </head>
  <body>
    <header>
      <h1>FreshBite</h1>
      <nav>
        <a href="#menu">Menu</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <section id="about">
        <h2>Fresh meals, warm atmosphere</h2>
        <p>Enjoy chef-made meals in a friendly environment.</p>
      </section>
      <section id="menu">
        <h3>Popular Meals</h3>
        <ul>
          <li>Grilled Chicken</li>
          <li>Garden Pasta</li>
          <li>Fruit Smoothie</li>
        </ul>
      </section>
    </main>
    <footer id="contact">
      <p>Book a table: 0800-123-456</p>
    </footer>
  </body>
</html>`
    },
    {
        level: 1,
        title: 'Event Promotion Page',
        description: 'Build a page for an upcoming event with speaker details, schedule highlights, and a register button.',
        tasks: [
            'Use headings for event title and sections.',
            'Add a schedule list with time and activity.',
            'Include a clear call-to-action button.',
            'Add a speaker or venue block.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dev Summit</title>
  </head>
  <body>
    <header>
      <h1>Dev Summit 2026</h1>
      <p>Learn from industry experts.</p>
      <a href="#register">Register Now</a>
    </header>
    <main>
      <section>
        <h2>Agenda</h2>
        <ul>
          <li>9:00 AM – Welcome</li>
          <li>10:00 AM – Frontend Talks</li>
          <li>12:00 PM – Networking</li>
        </ul>
      </section>
      <section>
        <h2>Speakers</h2>
        <p>Jane Johnson, UI Designer</p>
      </section>
    </main>
  </body>
</html>`
    },
    {
        level: 2,
        title: 'Product Landing Page',
        description: 'Design a product landing page with a top banner, benefits, price plan, and a final call to action.',
        tasks: [
            'Use structured sections for features and pricing.',
            'Add a hero banner with a product summary.',
            'Create at least three feature points.',
            'Include a final CTA section.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CloudFlow</title>
  </head>
  <body>
    <header>
      <h1>CloudFlow</h1>
      <nav>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
      </nav>
    </header>
    <main>
      <section>
        <h2>Work faster and smarter</h2>
        <p>Organize projects, tasks, and teams in one place.</p>
        <a href="#pricing">Get Started</a>
      </section>
      <section id="features">
        <h3>Why teams choose us</h3>
        <ul>
          <li>Easy collaboration</li>
          <li>Smart dashboards</li>
          <li>Fast deployment</li>
        </ul>
      </section>
      <section id="pricing">
        <h3>$25/month</h3>
      </section>
    </main>
  </body>
</html>`
    },
    {
        level: 2,
        title: 'Blog Homepage',
        description: 'Build a personal blog homepage with multiple posts, featured article, and subscribe form.',
        tasks: [
            'Write a blog title and introduction.',
            'Include an article preview list.',
            'Add a subscription form with inputs.',
            'Use clear section separation.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Daily Journal</title>
  </head>
  <body>
    <header>
      <h1>Daily Journal</h1>
    </header>
    <main>
      <section>
        <h2>Featured Story</h2>
        <p>Learning new skills every day unlocks bigger opportunities.</p>
      </section>
      <section>
        <h2>Latest Posts</h2>
        <ul>
          <li>How to Plan Your Week</li>
          <li>Designing Better Websites</li>
        </ul>
      </section>
      <section>
        <h2>Subscribe</h2>
        <form>
          <input type="email" placeholder="Your email" />
          <button type="submit">Submit</button>
        </form>
      </section>
    </main>
  </body>
</html>`
    },
    {
        level: 2,
        title: 'Travel Agency Landing Page',
        description: 'Create a travel website with destinations, offers, and booking callouts.',
        tasks: [
            'Add a travel features section.',
            'List at least three destinations.',
            'Include a booking prompt or call to action.',
            'Use a good content hierarchy.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blue Sky Travel</title>
  </head>
  <body>
    <header>
      <h1>Blue Sky Travel</h1>
      <nav>
        <a href="#offers">Offers</a>
        <a href="#destinations">Destinations</a>
      </nav>
    </header>
    <main>
      <section>
        <h2>Book your dream getaway</h2>
        <p>Explore beaches, mountains, and cities.</p>
      </section>
      <section id="destinations">
        <ul>
          <li>Paris</li>
          <li>Tokyo</li>
          <li>Bali</li>
        </ul>
      </section>
      <section id="offers">
        <h3>Special deals</h3>
        <p>Save up to 30% on selected destinations.</p>
      </section>
    </main>
  </body>
</html>`
    },
    {
        level: 3,
        title: 'Responsive Portfolio Layout',
        description: 'Build a portfolio with a header, hero section, projects grid, and an about section that looks clean on mobile screens.',
        tasks: [
            'Use a modern section layout.',
            'Build a project grid with cards.',
            'Add a responsive meta tag and mobile-friendly layout.',
            'Use semantic markup for readability.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Responsive Portfolio</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#about">About</a>
      </nav>
    </header>
    <main>
      <section id="home">
        <h1>Build Better Experiences</h1>
      </section>
      <section id="projects">
        <div>Project One</div>
        <div>Project Two</div>
        <div>Project Three</div>
      </section>
      <section id="about">
        <h2>About Me</h2>
        <p>I build accessible and responsive interfaces.</p>
      </section>
    </main>
  </body>
</html>`
    },
    {
        level: 3,
        title: 'Service Company Website',
        description: 'Create a service business home page with services, testimonials, and a contact form section.',
        tasks: [
            'Use headings and a clear central theme.',
            'Add a list of services and short descriptions.',
            'Include a simple contact form.',
            'Add testimonial or client feedback area.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nova Services</title>
  </head>
  <body>
    <header>
      <h1>Nova Services</h1>
      <nav>
        <a href="#services">Services</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <section id="services">
        <h2>Our Services</h2>
        <ul>
          <li>Web Design</li>
          <li>Brand Strategy</li>
          <li>SEO</li>
        </ul>
      </section>
      <section id="testimonials">
        <p>"Professional and easy to work with."</p>
      </section>
      <section id="contact">
        <form>
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Your email" />
          <button type="submit">Send</button>
        </form>
      </section>
    </main>
  </body>
</html>`
    },
    {
        level: 3,
        title: 'Dashboard Layout Wireframe',
        description: 'Design a dashboard-like page with summary cards, activity info, and a sidebar layout.',
        tasks: [
            'Add a top header and sidebar menu.',
            'Create 3 or 4 summary cards.',
            'Include a task or report area.',
            'Arrange the layout in a clean structure.'
        ],
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard</title>
  </head>
  <body>
    <aside>
      <h2>Menu</h2>
      <ul>
        <li>Overview</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </aside>
    <main>
      <header>
        <h1>Dashboard</h1>
      </header>
      <section>
        <div>Sales</div>
        <div>Visitors</div>
        <div>Orders</div>
      </section>
      <section>
        <h3>Latest Activity</h3>
        <p>New signups are trending upward.</p>
      </section>
    </main>
  </body>
</html>`
    }
];

const cssChallenges = [
    {
        title: 'Profile Card',
        description: 'Create a clean profile card with a circular avatar, title, and button-like action.',
        tasks: [
            'Use a card container with padding and rounded corners.',
            'Style the avatar as a circle.',
            'Set a contrasting button or action area.',
            'Apply a soft shadow and readable text colors.'
        ],
        preview: `
      <div class="demo-card">
        <div class="demo-avatar">JD</div>
        <h2>Jane Doe</h2>
        <p>Frontend Developer</p>
        <button>View Profile</button>
      </div>
    `,
        solution: `
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        background: #e2e8f0;
        font-family: Arial, sans-serif;
      }
      .demo-card {
        width: 280px;
        background: white;
        border-radius: 18px;
        padding: 24px;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
        text-align: center;
      }
      .demo-avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, #38bdf8, #4f46e5);
        color: white;
        display: grid;
        place-items: center;
        margin: 0 auto 16px;
        font-weight: 700;
      }
      button {
        background: #0ea5e9;
        color: white;
        border: none;
        padding: 10px 18px;
        border-radius: 999px;
        margin-top: 12px;
      }
    `
    },
    {
        title: 'Pricing Section',
        description: 'Style a pricing card group with highlighted featured plan and balanced spacing.',
        tasks: [
            'Use a flex row for multiple pricing cards.',
            'Highlight one plan using a stronger border or background.',
            'Keep spacing consistent and readable.',
            'Style the action button clearly.'
        ],
        preview: `
      <div class="pricing-wrap">
        <div class="price-card">
          <h3>Starter</h3>
          <p>$9</p>
          <button>Choose</button>
        </div>
        <div class="price-card featured">
          <h3>Pro</h3>
          <p>$19</p>
          <button>Choose</button>
        </div>
      </div>
    `,
        solution: `
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        background: #f8fafc;
        font-family: Arial, sans-serif;
      }
      .pricing-wrap {
        display: flex;
        gap: 16px;
      }
      .price-card {
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 16px;
        padding: 24px;
        width: 180px;
        text-align: center;
      }
      .featured {
        background: #eff6ff;
        border: 2px solid #60a5fa;
      }
      button {
        background: #1d4ed8;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 10px;
      }
    `
    },
    {
        title: 'Hero Banner',
        description: 'Build a colorful landing-style hero section with a headline, paragraph, and primary CTA.',
        tasks: [
            'Set a gradient or strong colored background.',
            'Use large heading text with spacing.',
            'Add a call-to-action button.',
            'Keep the layout centered and readable.'
        ],
        preview: `
      <div class="hero">
        <h1>Learn faster</h1>
        <p>Build skills with guided projects and real feedback.</p>
        <button>Start Now</button>
      </div>
    `,
        solution: `
      body {
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #1e293b, #0ea5e9);
        font-family: Arial, sans-serif;
      }
      .hero {
        width: 80%;
        background: rgba(255,255,255,0.12);
        padding: 30px;
        border-radius: 18px;
        text-align: center;
        color: white;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 2.5rem;
      }
      button {
        padding: 12px 20px;
        border: none;
        border-radius: 999px;
        background: white;
        color: #0f172a;
        font-weight: 700;
      }
    `
    }
];

function generateProjectForLevel(levelIndex, taskSeed) {
    const level = Math.max(0, Number(levelIndex) || 0);
    const seed = Math.max(0, Number(taskSeed) || 0);
    const themes = ['Portfolio', 'Business', 'Course', 'Product', 'Magazine', 'Agency', 'Travel', 'Startup'];
    const theme = themes[seed % themes.length];
    const sectionNames = ['About', 'Features', 'Highlights', 'Services', 'Results', 'Reviews'];
    const primarySection = sectionNames[(seed + level) % sectionNames.length];
    const secondarySection = sectionNames[(seed + 2 + level) % sectionNames.length];
    const taskCount = Math.min(15, 6 + level * 2);

    const tasks = [
        `Use a clear page title and a strong introductory headline.`,
        `Create a semantic layout with ${2 + level} main sections or containers.`,
        `Add a navigation bar or a primary call-to-action link.`,
        `Include ${Math.min(6, 2 + level)} content blocks such as lists, cards, or feature details.`,
        `Use at least ${Math.min(4, 2 + level)} paragraphs or descriptive text elements.`,
        `Add a form, testimonial, or contact area for stronger structure.`
    ];

    while (tasks.length < taskCount) {
        tasks.push(`Add a polished ${secondarySection.toLowerCase()} section with stronger content hierarchy and a ${level + 2}-part layout.`);
    }

    const sectionMarkup = Array.from({ length: 2 + level }, (_, index) => {
        const name = sectionNames[(index + seed) % sectionNames.length];
        const itemCount = Math.min(6, 2 + level + index);
        const listItems = Array.from({ length: itemCount }, (_, itemIndex) => `<li>${name} point ${itemIndex + 1}</li>`).join('');
        return `
      <section id="${name.toLowerCase()}-${index + 1}">
        <h2>${name}</h2>
        <p>Build a clear summary for this ${name.toLowerCase()} area.</p>
        <ul>${listItems}</ul>
      </section>`;
    }).join('');

    const solution = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${theme} Studio</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="#home">Home</a>
        <a href="#${primarySection.toLowerCase()}">${primarySection}</a>
        <a href="#contact">Contact</a>
      </nav>
      <h1>${theme} ${level > 0 ? 'Challenge' : 'Landing Page'}</h1>
      <p>Create a polished layout for a modern web project.</p>
      <a href="#contact">Start learning</a>
    </header>
    <main>
      <section id="home">
        <h2>Welcome</h2>
        <p>Design a focused experience with strong structure and readable content.</p>
      </section>
      ${sectionMarkup}
      <section id="contact">
        <h2>Contact</h2>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      </section>
    </main>
    <footer>
      <p>Practice and improve every day.</p>
    </footer>
  </body>
</html>`;

    return {
        id: `generated-${level}-${seed}-${theme}`,
        level,
        title: `${theme} Challenge ${seed + 1}`,
        description: `Build a ${theme.toLowerCase()} page with deeper structure, stronger hierarchy, and more advanced sections as you reach level ${level + 1}.`,
        tasks,
        solution,
        requirements: [
            { pattern: /<header|<nav|<main|<section|<footer/gi, weight: 18 },
            { pattern: /<h1|<h2|<h3/gi, weight: 18 },
            { pattern: /<ul|<ol/gi, weight: 16 },
            { pattern: /<a\s+href=/gi, weight: 14 },
            { pattern: /<form|<input|<button/gi, weight: 14 },
            { pattern: /<p\s*>|<p\s+[^>]*>/gi, weight: 10 },
            { pattern: /id=\"[a-z-]+\"/gi, weight: 10 }
        ]
    };
}

function buildLevelProjectPool(levelIndex) {
    const generatedCount = (Math.max(0, Number(levelIndex) || 0) + 1) * 10;
    const pool = [];
    for (let index = 0; index < generatedCount; index += 1) {
        pool.push(generateProjectForLevel(levelIndex, index));
    }
    return pool;
}

const customLevelPools = {};

function getLevelProjects(levelIndex) {
    if (!customLevelPools[levelIndex]) {
        const bankProjects = htmlProjectBank.filter((project) => project.level === levelIndex);
        customLevelPools[levelIndex] = bankProjects.length > 0 ? [...bankProjects] : buildLevelProjectPool(levelIndex);
    }
    return customLevelPools[levelIndex];
}

function getCurrentProject() {
    const currentLevel = getCurrentLevelIndex();
    const levelProjects = getLevelProjects(currentLevel);
    const safeIndex = ((state.currentProjectIndex % levelProjects.length) + levelProjects.length) % levelProjects.length;
    return levelProjects[safeIndex];
}

function normalizeHtmlProgress(rawState) {
    if (!rawState) {
        return {
            xp: 0,
            projectsDone: 0,
            currentProjectIndex: 0,
            submittedProjectIds: [],
            lastLevel: 0,
            bestScore: 0,
            lastScore: 0
        };
    }

    return {
        xp: Number(rawState.xp) || 0,
        projectsDone: Number(rawState.projectsDone) || 0,
        currentProjectIndex: Number(rawState.currentProjectIndex) || 0,
        submittedProjectIds: Array.isArray(rawState.submittedProjectIds) ? rawState.submittedProjectIds : [],
        lastLevel: Number(rawState.lastLevel) || 0,
        bestScore: Number(rawState.bestScore) || 0,
        lastScore: Number(rawState.lastScore) || 0
    };
}

const state = normalizeHtmlProgress(loadHtmlProgress());
const users = loadUsers();
let currentCssIndex = 0;
let htmlTimerInterval = null;
let cssTimerInterval = null;
let activeHtmlTimerId = null;
let activeCssTimerId = null;
let htmlSecondsRemaining = 0;
let cssSecondsRemaining = 0;

const projectTitle = document.getElementById('projectTitle');
const projectDescription = document.getElementById('projectDescription');
const taskList = document.getElementById('taskList');
const levelValue = document.getElementById('levelValue');
const xpValue = document.getElementById('xpValue');
const projectValue = document.getElementById('projectsValue');
const scoreValue = document.getElementById('scoreValue');
const statusPill = document.getElementById('statusPill');
const levelBadge = document.getElementById('levelBadge');
const levelList = document.getElementById('levelList');
const progressFill = document.getElementById('progressFill');
const statusMessage = document.getElementById('statusMessage');
const solutionBox = document.getElementById('solutionBox');
const solutionOutput = document.getElementById('solutionOutput');
const projectPreview = document.getElementById('projectPreview');
const codeInput = document.getElementById('codeInput');
const htmlTimer = document.getElementById('htmlTimer');
const htmlComplexity = document.getElementById('htmlComplexity');

const cssChallengeTitle = document.getElementById('cssChallengeTitle');
const cssChallengeDescription = document.getElementById('cssChallengeDescription');
const cssTaskList = document.getElementById('cssTaskList');
const cssStatusMessage = document.getElementById('cssStatusMessage');
const cssCodeInput = document.getElementById('cssCodeInput');
const cssPreviewFrame = document.getElementById('cssPreviewFrame');
const cssSolutionBox = document.getElementById('cssSolutionBox');
const cssSolutionOutput = document.getElementById('cssSolutionOutput');
const cssTimer = document.getElementById('cssTimer');
const cssComplexity = document.getElementById('cssComplexity');

const complexityNames = ['Beginner', 'Developing', 'Intermediate', 'Advanced', 'Expert'];

function getChallengeComplexity(challenge) {
  const level = Math.max(0, Number(challenge.level) || 0);
  return complexityNames[Math.min(level, complexityNames.length - 1)];
}

function getChallengeMinutes(challenge, isAi) {
  const level = Math.max(0, Number(challenge.level) || 0);
  return Number(challenge.durationMinutes) || (isAi ? 25 + (level * 10) : 15 + (level * 8));
}

function formatTimer(seconds) {
  const safeSeconds = Math.max(0, seconds);
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

function startChallengeTimer(challenge, timerElement, complexityElement, isAi, type) {
  const timerId = challenge.id || challenge.title;
  const isHtml = type === 'html';
  const activeId = isHtml ? activeHtmlTimerId : activeCssTimerId;
  if (activeId !== timerId) {
    const seconds = getChallengeMinutes(challenge, isAi) * 60;
    if (isHtml) {
      activeHtmlTimerId = timerId;
      htmlSecondsRemaining = seconds;
      clearInterval(htmlTimerInterval);
      htmlTimerInterval = null;
    } else {
      activeCssTimerId = timerId;
      cssSecondsRemaining = seconds;
      clearInterval(cssTimerInterval);
      cssTimerInterval = null;
    }
  }

  complexityElement.textContent = `Complexity: ${getChallengeComplexity(challenge)}`;
  const updateTimer = () => {
    const remaining = isHtml ? htmlSecondsRemaining : cssSecondsRemaining;
    timerElement.textContent = remaining > 0 ? `Time: ${formatTimer(remaining)}` : 'Time: 00:00';
    timerElement.classList.toggle('timer-warning', remaining > 0 && remaining <= 60);
    if (remaining <= 0) {
      if (isHtml) {
        clearInterval(htmlTimerInterval);
        htmlTimerInterval = null;
      } else {
        clearInterval(cssTimerInterval);
        cssTimerInterval = null;
      }
      return;
    }
    if (isHtml) {
      htmlSecondsRemaining -= 1;
    } else {
      cssSecondsRemaining -= 1;
    }
  };

  updateTimer();
  if (isHtml && !htmlTimerInterval && htmlSecondsRemaining > 0) {
    htmlTimerInterval = setInterval(updateTimer, 1000);
  }
  if (!isHtml && !cssTimerInterval && cssSecondsRemaining > 0) {
    cssTimerInterval = setInterval(updateTimer, 1000);
  }
}

function getDisplayedTasks(challenge, isAi) {
  const tasks = [...challenge.tasks];
  const extras = isAi
    ? [
      'Test the finished challenge at a mobile viewport.',
      'Review the result for accessibility and clear user feedback.',
      'Keep the implementation organized so another developer can extend it.'
    ]
    : [
      'Check the finished page with a browser preview before submitting.',
      'Use meaningful text and labels so another person can understand the interface.',
      'Review the markup or styles for consistency and easy maintenance.'
    ];
  tasks.push(...extras.slice(0, Math.min(3, 1 + (Number(challenge.level) || 0))));
  return tasks;
}

function getCssChallengeLevel(challenge, index) {
  if (Number.isFinite(Number(challenge.level))) {
    return Number(challenge.level);
  }
  return Math.min(Math.floor(index / 2), levelNames.length - 1);
}

function getTaskBrief(challenge, type) {
  return `${type.toUpperCase()} TASK: ${challenge.title}\n\n${challenge.description}\n\nRequirements:\n${getDisplayedTasks(challenge, challenge.title.includes('AI')).join('\n')}`;
}

async function openTaskInVsCode(challenge, type) {
  const brief = getTaskBrief(challenge, type);
  try {
    await navigator.clipboard.writeText(brief);
    statusMessage.textContent = 'Task copied. VS Code is opening; paste it into your task file.';
    cssStatusMessage.textContent = 'Task copied. VS Code is opening; paste it into your task file.';
  } catch (error) {
    statusMessage.textContent = 'VS Code is opening. Copy the task requirements from this page.';
  }

  if (window.location.protocol !== 'file:') {
    const workspacePath = new URLSearchParams(window.location.search).get('workspace') || DEFAULT_WORKSPACE_PATH;
    const vscodeUri = `vscode://file/${encodeURI(workspacePath)}`;
    statusMessage.textContent = 'Opening this project in VS Code...';
    cssStatusMessage.textContent = 'Opening this project in VS Code...';
    window.location.href = vscodeUri;
    return;
  }

  const filePath = decodeURIComponent(window.location.pathname);
  const folderPath = filePath.substring(0, filePath.lastIndexOf('/')) || filePath;
  const windowsFolderPath = folderPath.replace(/^\/(\w:)/, '$1');
  const vscodeUri = `vscode://file/${encodeURI(windowsFolderPath)}`;
  window.location.href = vscodeUri;
}

const authView = document.getElementById('authView');
const dashboardView = document.getElementById('dashboardView');
const cssView = document.getElementById('cssView');
const profileView = document.getElementById('profileView');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const profileLevelBadge = document.getElementById('profileLevelBadge');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileXp = document.getElementById('profileXp');
const profileHtmlTasks = document.getElementById('profileHtmlTasks');
const profileCssTasks = document.getElementById('profileCssTasks');
const profileBestScore = document.getElementById('profileBestScore');

function loadHtmlProgress() {
  const userKey = localStorage.getItem(CURRENT_USER_KEY);
  const scopedKey = `${HTML_PROGRESS_KEY}:${(userKey || 'guest').toLowerCase()}`;
  const savedState = localStorage.getItem(scopedKey) || localStorage.getItem(HTML_PROGRESS_KEY);
    return savedState ? JSON.parse(savedState) : null;
}

function loadUsers() {
    const savedUsers = localStorage.getItem(USERS_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
}

function saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveHtmlProgress() {
  const userKey = localStorage.getItem(CURRENT_USER_KEY);
  const scopedKey = `${HTML_PROGRESS_KEY}:${(userKey || 'guest').toLowerCase()}`;
  localStorage.setItem(scopedKey, JSON.stringify(state));
}

function normalizeUser(account) {
    return {
        name: account.name || 'Student',
        email: account.email || '',
        password: account.password || '',
        xp: Number(account.xp) || 0,
        htmlTasks: Number(account.htmlTasks) || 0,
        cssTests: Number(account.cssTests) || 0,
        bestScore: Number(account.bestScore) || 0,
        cssBestScore: Number(account.cssBestScore) || 0,
        failedStreak: Number(account.failedStreak) || 0,
        cssSubmittedChallengeIds: Array.isArray(account.cssSubmittedChallengeIds)
          ? account.cssSubmittedChallengeIds
          : []
    };
}

function getCurrentUser() {
    const currentEmail = localStorage.getItem(CURRENT_USER_KEY);
    return users.find((user) => user.email.toLowerCase() === (currentEmail || '').toLowerCase()) || null;
}

function setCurrentUser(email) {
    localStorage.setItem(CURRENT_USER_KEY, email);
  Object.assign(state, normalizeHtmlProgress(loadHtmlProgress()));
}

function getLevelFromXp(totalXp) {
    const safeXp = Number(totalXp) || 0;
    if (safeXp < LEVEL_STEP_XP) {
        return 0;
    }

    const levelIndex = Math.floor(safeXp / LEVEL_STEP_XP);
    return Math.min(levelIndex, levelNames.length - 1);
}

function updateProfileUI() {
    const user = getCurrentUser();
  if (!user || !profileLevelBadge || !profileName || !profileEmail || !profileXp || !profileHtmlTasks || !profileCssTasks || !profileBestScore) {
        return;
    }

    const levelIndex = getLevelFromXp(user.xp || 0);
    const levelName = levelNames[levelIndex];

    profileLevelBadge.textContent = `Level ${levelIndex + 1} • ${levelName}`;
    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    profileXp.textContent = `${user.xp || 0} XP`;
    profileHtmlTasks.textContent = `${user.htmlTasks || 0}`;
    profileCssTasks.textContent = `${user.cssTests || 0}`;
    profileBestScore.textContent = `${user.bestScore || 0}%`;
}

function showView(viewName) {
    const allViews = [authView, dashboardView, cssView, profileView];
    allViews.forEach((view) => {
    if (view) {
      view.classList.add('hidden');
    }
    });

    const target = {
        authView,
        dashboardView,
        cssView,
        profileView
    }[viewName];

    if (target) {
        target.classList.remove('hidden');
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.view === viewName);
    });

    if (logoutBtn) {
      logoutBtn.classList.toggle('hidden', !getCurrentUser());
    }
}

  function navigateToPage(page) {
    window.location.href = page;
  }

function getCurrentLevelIndex() {
    const user = getCurrentUser();
    const totalXp = user ? (user.xp || 0) : (state.xp || 0);
    return getLevelFromXp(totalXp);
}

function isProjectSubmitted(project) {
    return state.submittedProjectIds.includes(project.title);
}

function renderRoadmap() {
  if (!levelList) {
    return;
  }

    levelList.innerHTML = '';
    levelNames.forEach((levelName, index) => {
        const item = document.createElement('li');
        const currentLevelIndex = getCurrentLevelIndex();
        item.textContent = `${index + 1}. ${levelName}${index === currentLevelIndex ? ' • Current' : ''}`;
        levelList.appendChild(item);
    });
}

function getPerformanceScore(submittedCode, project) {
    const cleanCode = (submittedCode || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const solutionText = (project.solution || '').replace(/\s+/g, ' ').trim().toLowerCase();

    if (!cleanCode) {
        return 0;
    }

    const requiredChecks = [
      { pattern: /<h1|<h2|<h3/i, weight: 15 },
      { pattern: /<p/i, weight: 10 },
      { pattern: /<ul|<ol/i, weight: 10 },
      { pattern: /<a\s+href=/i, weight: 10 },
      { pattern: /<img/i, weight: 10 },
      { pattern: /<form|<input|<button/i, weight: 10 },
      { pattern: /<nav/i, weight: 10 },
      { pattern: /<header|<main|<footer|<section/i, weight: 15 },
      { pattern: /id="[a-z0-9-]+"/i, weight: 10 }
    ].filter(({ pattern }) => pattern.test(solutionText));

    const earnedWeight = requiredChecks.reduce((total, check) => {
      return total + (check.pattern.test(cleanCode) ? check.weight : 0);
    }, 0);
    const availableWeight = requiredChecks.reduce((total, check) => total + check.weight, 0) || 1;
    const structureScore = (earnedWeight / availableWeight) * 100;
    const similarity = Math.min((cleanCode.length / Math.max(solutionText.length, 1)) * 100, 100);
    const performance = Math.round((similarity * 0.25) + (structureScore * 0.75));

    return Math.max(0, Math.min(100, performance));
}

  function buildCombinedPreviewMarkup(htmlMarkup, cssMarkup) {
    const fallbackMarkup = '<p>Preview content is unavailable.</p>';
    const markup = (htmlMarkup || '').trim() || fallbackMarkup;
    const styleMarkup = cssMarkup ? `<style>${cssMarkup}</style>` : '';

    if (/<\/head>/i.test(markup)) {
      return markup.replace(/<\/head>/i, `${styleMarkup}</head>`);
    }

    if (/<body(?:\s[^>]*)?>/i.test(markup)) {
      return markup.replace(/(<body(?:\s[^>]*)?>)/i, `$1${styleMarkup}`);
    }

    return `<!DOCTYPE html><html lang="en"><head>${styleMarkup}</head><body>${markup}</body></html>`;
  }

  function setPreviewMarkup(previewFrame, htmlMarkup, cssMarkup) {
    if (!previewFrame) {
      return;
    }

    previewFrame.removeAttribute('src');
    previewFrame.setAttribute('srcdoc', buildCombinedPreviewMarkup(htmlMarkup, cssMarkup));
  }

  function renderProjectPreview(project) {
    const projectMarkup = codeInput.value.trim() || (project && project.solution) || '';
    setPreviewMarkup(projectPreview, projectMarkup, cssCodeInput.value.trim());
  }

  function renderCssPreview(challenge) {
    const htmlMarkup = codeInput.value.trim() || challenge.preview;
    const cssMarkup = cssCodeInput.value.trim() || challenge.solution;
    setPreviewMarkup(cssPreviewFrame, htmlMarkup, cssMarkup);
  }

function refreshDashboard() {
    const user = getCurrentUser();
    const totalXp = user ? (user.xp || 0) : (state.xp || 0);
    const currentLevel = getCurrentLevelIndex();
    const project = getCurrentProject();

    if (!project) {
        return;
    }

    const levelName = levelNames[currentLevel];
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;
    renderProjectPreview(project);
    startChallengeTimer(project, htmlTimer, htmlComplexity, project.title.includes('AI'), 'html');

    taskList.innerHTML = '';
    getDisplayedTasks(project, project.title.includes('AI')).forEach((task) => {
        const item = document.createElement('li');
        item.textContent = task;
        taskList.appendChild(item);
    });

    levelValue.textContent = levelName;
    levelBadge.textContent = levelName;
    statusPill.textContent = `Level ${currentLevel + 1} • ${levelName}`;
    xpValue.textContent = `${totalXp} XP`;
    projectValue.textContent = String(user ? (user.htmlTasks || 0) : (state.projectsDone || 0));
    scoreValue.textContent = `${user ? (user.bestScore || 0) : (state.bestScore || 0)}%`;

    const totalXpCap = xpThresholds[xpThresholds.length - 1] + LEVEL_STEP_XP;
    const progress = Math.min((totalXp / totalXpCap) * 100, 100);
    progressFill.style.width = `${progress}%`;

    if (isProjectSubmitted(project)) {
        solutionBox.classList.add('visible');
      solutionBox.classList.remove('protected-solution');
        solutionOutput.textContent = project.solution;
        statusMessage.textContent = 'Nice work — the solution is unlocked.';
    } else {
        solutionBox.classList.remove('visible');
      solutionBox.classList.remove('protected-solution');
        solutionOutput.textContent = '';
        statusMessage.textContent = 'Submit your code to earn XP and get reviewed.';
    }

    renderRoadmap();
    saveHtmlProgress();
}

function buildProtectedCodeMarkup(code) {
    const safeText = `Protected solution\nCopying and screenshots are disabled.`;
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="880" height="520" viewBox="0 0 880 520">
      <defs>
        <linearGradient id="bg" x1="0" x2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="36" y="52" fill="#38bdf8" font-size="26" font-family="Consolas, monospace" font-weight="700">Solution hidden</text>
      <text x="36" y="92" fill="#fbbf24" font-size="18" font-family="Consolas, monospace">Protected review mode</text>
      <rect x="30" y="120" width="820" height="350" rx="16" fill="#111827" stroke="#334155"/>
      <text x="56" y="170" fill="#7dd3fc" font-size="16" font-family="Consolas, monospace">██████████████████</text>
      <text x="56" y="210" fill="#7dd3fc" font-size="16" font-family="Consolas, monospace">███████ protected ███████</text>
      <text x="56" y="250" fill="#7dd3fc" font-size="16" font-family="Consolas, monospace">██████████████████</text>
      <text x="56" y="290" fill="#7dd3fc" font-size="16" font-family="Consolas, monospace">████████ no copy ████████</text>
      <text x="56" y="330" fill="#7dd3fc" font-size="16" font-family="Consolas, monospace">████████ no screenshot ███████</text>
      <text x="56" y="370" fill="#7dd3fc" font-size="16" font-family="Consolas, monospace">██████████████████</text>
      <text x="56" y="430" fill="#f1f5f9" font-size="16" font-family="Consolas, monospace">${safeText}</text>
    </svg>
  `;

    const encoded = encodeURIComponent(svg);
    return `<div class="obscured-solution"><img src="data:image/svg+xml;charset=utf-8,${encoded}" alt="Protected solution" draggable="false" /></div>`;
}

function applyTaskOutcome(isSuccess) {
    const user = getCurrentUser();
    if (!user) {
        statusMessage.textContent = 'Login first to track XP and level progress.';
        return;
    }

    const currentMisses = Number(user.failedStreak) || 0;

    if (isSuccess) {
        user.failedStreak = 0;
        user.xp = (user.xp || 0) + XP_PER_SUCCESS;
        user.htmlTasks = (user.htmlTasks || 0) + 1;
        statusMessage.textContent = `Task passed. +${XP_PER_SUCCESS} XP awarded.`;
    } else {
        user.failedStreak = currentMisses + 1;
        user.xp = (user.xp || 0) + XP_PER_FAILURE;

        if (user.failedStreak >= 3) {
            user.xp = Math.max(0, (user.xp || 0) - XP_FAIL_STREAK_PENALTY);
            statusMessage.textContent = `Three failed tasks in a row. -${XP_FAIL_STREAK_PENALTY} XP penalty.`;
            user.failedStreak = 0;
        } else {
            statusMessage.textContent = `Task failed. +${XP_PER_FAILURE} XP awarded for trying.`;
        }
    }

    const previousLevel = getLevelFromXp((state.xp || 0));
    state.xp = user.xp;
    const nextLevel = getLevelFromXp(user.xp || 0);
    if (nextLevel > previousLevel && user.xp >= LEVEL_STEP_XP) {
        statusMessage.textContent += ` Level up to ${levelNames[nextLevel]}.`;
    }

    if (user.xp < LEVEL_STEP_XP && previousLevel !== 0) {
        statusMessage.textContent += ` Level stays locked until ${LEVEL_STEP_XP} XP is reached.`;
    }

    saveUsers();
    saveHtmlProgress();
    updateProfileUI();
    refreshDashboard();
}

function awardHtmlXp(project) {
    const user = getCurrentUser();
    if (!project || !user) {
        if (!user) {
            statusMessage.textContent = 'Login first to submit your code.';
        }
    return false;
    }

    const submittedCode = codeInput.value.trim();
    if (!submittedCode) {
        statusMessage.textContent = 'Paste your HTML first, then submit it for review.';
    return false;
    }

    if (htmlSecondsRemaining <= 0) {
      statusMessage.textContent = 'Time is up. Start a new challenge before submitting again.';
    return false;
    }

    const score = getPerformanceScore(submittedCode, project);
    const passed = score >= 70;

    if (passed) {
        user.bestScore = Math.max(user.bestScore || 0, score);
        state.bestScore = user.bestScore;
        if (!state.submittedProjectIds.includes(project.title)) {
            state.submittedProjectIds.push(project.title);
        }
        applyTaskOutcome(true);
        solutionBox.classList.add('visible');
        solutionBox.classList.remove('protected-solution');
        solutionOutput.textContent = project.solution;
        return true;
    }

    user.bestScore = Math.max(user.bestScore || 0, score);
    state.bestScore = user.bestScore;
    applyTaskOutcome(false);
    solutionBox.classList.add('visible');
    solutionBox.classList.add('protected-solution');
    solutionOutput.innerHTML = buildProtectedCodeMarkup(project.solution);
    statusMessage.textContent = `Wrong code submitted. The solution is protected and cannot be copied or captured. ${statusMessage.textContent}`;

    document.addEventListener('contextmenu', (event) => {
        if (solutionBox.classList.contains('visible') && solutionOutput.innerHTML.includes('Protected solution')) {
            event.preventDefault();
        }
    }, { once: true });
    return true;
}

  function openCssStylingStep() {
    showView('cssView');
    renderCssChallenge();
    cssStatusMessage.textContent = 'HTML submitted. Style that page with CSS before starting a new HTML test.';
    cssCodeInput.focus();
  }

function revealHtmlSolution() {
    const project = getCurrentProject();
    if (!project) {
        return;
    }

    solutionBox.classList.add('visible');
    solutionBox.classList.remove('protected-solution');
    solutionOutput.textContent = project.solution;
    statusMessage.textContent = 'Solution revealed for review.';
}

function advanceProject() {
    const currentLevel = getCurrentLevelIndex();
    const levelProjects = getLevelProjects(currentLevel);

    if (!levelProjects.length) {
        return;
    }

    state.currentProjectIndex = (state.currentProjectIndex + 1) % levelProjects.length;
    codeInput.value = '';
    cssCodeInput.value = '';
    solutionBox.classList.remove('visible');
    solutionOutput.textContent = '';
    statusMessage.textContent = 'A new challenge is ready.';
    refreshDashboard();
}

function resetProgress() {
    const user = getCurrentUser();
    const resetState = {
        xp: 0,
        projectsDone: 0,
        currentProjectIndex: 0,
        submittedProjectIds: [],
        lastLevel: 0,
        lastScore: 0,
        bestScore: 0
    };

    Object.assign(state, resetState);
    if (user) {
        user.xp = 0;
        user.htmlTasks = 0;
        user.bestScore = 0;
        user.failedStreak = 0;
        saveUsers();
    }

    codeInput.value = '';
    statusMessage.textContent = 'Progress reset. Start again from Beginner.';
    refreshDashboard();
    updateProfileUI();
}

function renderCssChallenge() {
  const challengeIndex = currentCssIndex % cssChallenges.length;
  const rawChallenge = cssChallenges[challengeIndex];
  const challenge = { ...rawChallenge, level: getCssChallengeLevel(rawChallenge, challengeIndex) };
    cssChallengeTitle.textContent = challenge.title;
    cssChallengeDescription.textContent = challenge.description;
  startChallengeTimer(challenge, cssTimer, cssComplexity, challenge.title.includes('AI'), 'css');
    cssTaskList.innerHTML = '';
  getDisplayedTasks(challenge, challenge.title.includes('AI')).forEach((task) => {
        const item = document.createElement('li');
        item.textContent = task;
        cssTaskList.appendChild(item);
    });
    renderCssPreview(challenge);
    cssSolutionBox.classList.remove('visible');
    cssSolutionOutput.textContent = '';
    cssStatusMessage.textContent = 'Build a clean card layout using CSS.';
}

function evaluateCssSubmission() {
    const user = getCurrentUser();
    if (!user) {
        cssStatusMessage.textContent = 'Login first to submit a CSS test.';
        return;
    }

    const cssCode = cssCodeInput.value.trim();
    if (!cssCode) {
        cssStatusMessage.textContent = 'Write some CSS before submitting the test.';
        return;
    }

    if (cssSecondsRemaining <= 0) {
      cssStatusMessage.textContent = 'Time is up. Start a new CSS challenge before submitting again.';
      return;
    }

    const challenge = cssChallenges[currentCssIndex % cssChallenges.length];
    const normalized = cssCode.toLowerCase();
    const checks = [
        { pattern: /display\s*:\s*flex/i, points: 20 },
        { pattern: /border-radius\s*:/i, points: 15 },
        { pattern: /padding\s*:/i, points: 15 },
        { pattern: /background(?:-color)?\s*:/i, points: 15 },
        { pattern: /box-shadow\s*:/i, points: 15 },
        { pattern: /color\s*:/i, points: 10 },
        { pattern: /width\s*:\s*\d+px|max-width\s*:/i, points: 10 }
    ];

    let score = 0;
    checks.forEach(({ pattern, points }) => {
        if (pattern.test(normalized)) {
            score += points;
        }
    });

    const similarityBonus = normalized.includes('card') || normalized.includes('pricing') || normalized.includes('hero') ? 10 : 0;
    const finalScore = Math.min(100, Math.round(score + similarityBonus));
    const xpAward = Math.round((finalScore / 100) * 140) + 30;
    const challengeId = challenge.id || challenge.title;
    const alreadySubmitted = user.cssSubmittedChallengeIds.includes(challengeId);

    if (!alreadySubmitted) {
      user.xp = (user.xp || 0) + xpAward;
      user.cssTests = (user.cssTests || 0) + 1;
      user.cssSubmittedChallengeIds.push(challengeId);
    }
    user.cssBestScore = Math.max(user.cssBestScore || 0, finalScore);
    user.bestScore = Math.max(user.bestScore || 0, finalScore);

    cssStatusMessage.textContent = alreadySubmitted
      ? `CSS review: ${finalScore}% accuracy. This challenge was already rewarded.`
      : `CSS review: ${finalScore}% accuracy. +${xpAward} XP awarded.`;
    cssSolutionBox.classList.add('visible');
    cssSolutionOutput.textContent = challenge.solution;
    saveUsers();
    updateProfileUI();
    refreshDashboard();
}

function revealCssSolution() {
    const challenge = cssChallenges[currentCssIndex % cssChallenges.length];
    cssSolutionBox.classList.add('visible');
    cssSolutionOutput.textContent = challenge.solution;
    cssStatusMessage.textContent = 'CSS solution revealed for review.';
}

function nextCssChallenge() {
    currentCssIndex += 1;
  codeInput.value = '';
    cssCodeInput.value = '';
    renderCssChallenge();
}

function handleAuthToggle(event) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.auth === event.target.dataset.auth);
    });

    const isLogin = event.target.dataset.auth === 'login';
    loginForm.classList.toggle('hidden', !isLogin);
    registerForm.classList.toggle('hidden', isLogin);
}

function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const user = normalizeUser(users.find((item) => item.email.toLowerCase() === email.toLowerCase()));

    if (!user.email || user.password !== password) {
        statusMessage.textContent = 'Incorrect email or password.';
        return;
    }

    setCurrentUser(user.email);
    navigateToPage('index.html');
    refreshDashboard();
    updateProfileUI();
    loginForm.reset();
}

function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        statusMessage.textContent = 'Please complete all registration fields.';
        return;
    }

    const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        statusMessage.textContent = 'An account with this email already exists.';
        return;
    }

    const newUser = normalizeUser({
        name,
        email,
        password,
        xp: 0,
        htmlTasks: 0,
        cssTests: 0,
        bestScore: 0,
        cssBestScore: 0,
        failedStreak: 0
    });

    users.push(newUser);
    saveUsers();
    setCurrentUser(newUser.email);
    navigateToPage('index.html');
    updateProfileUI();
    refreshDashboard();
    registerForm.reset();
}

function logoutUser() {
    if (firebaseReady && firebaseAuth) {
        firebaseAuth.signOut().catch(() => { });
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    navigateToPage('auth.html');
}

function handleGoogleSignIn() {
    if (!firebaseReady || !firebaseAuth) {
        statusMessage.textContent = 'Google sign-in is not configured yet. Add your Firebase config values in script.js.';
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    firebaseAuth.signInWithPopup(provider)
        .then((result) => {
            const googleUser = result.user;
            const profile = normalizeUser({
                name: googleUser.displayName || 'Google User',
                email: googleUser.email,
                password: 'google-auth',
                xp: 0,
                htmlTasks: 0,
                cssTests: 0,
                bestScore: 0,
                cssBestScore: 0,
                failedStreak: 0
            });

            const existing = users.find((user) => user.email.toLowerCase() === profile.email.toLowerCase());
            if (!existing) {
                users.push(profile);
            } else {
                Object.assign(existing, profile);
            }

            saveUsers();
            setCurrentUser(profile.email);
            navigateToPage('index.html');
            refreshDashboard();
            updateProfileUI();
            loginForm.reset();
            registerForm.reset();
        })
        .catch((error) => {
            const redirectFallbackCodes = [
                'auth/popup-blocked',
                'auth/popup-closed-by-user',
                'auth/cancelled-popup-request',
                'auth/operation-not-supported-in-this-environment'
            ];

            if (redirectFallbackCodes.includes(error.code)) {
                statusMessage.textContent = 'Opening Google sign-in...';
                firebaseAuth.signInWithRedirect(provider).catch((redirectError) => {
                    statusMessage.textContent = `Google sign-in failed: ${redirectError.message}`;
                });
                return;
            }

            if (error.code === 'auth/unauthorized-domain') {
                statusMessage.textContent = 'This deployed domain is not authorized in Firebase Authentication.';
                return;
            }

            statusMessage.textContent = `Google sign-in failed: ${error.message}`;
        });
}

function generateAiTaskForLevel(levelIndex) {
    const level = Math.max(0, Number(levelIndex) || 0);
    const topics = [
        'E-commerce Product Showcase', 'Tech Startup Landing Page', 'Photography Portfolio',
        'Fitness Tracker Dashboard', 'Music Event Flyer', 'Recipe Card Collection'
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const timeSeed = Date.now();

    const levelTasks = {
        0: [
            `1. Add a document root title with an <h1> heading for ${randomTopic}.`,
            `2. Write a short introductory paragraph (<p>) below the main title.`,
            `3. Insert an <h2> subheader to introduce a feature section.`,
            `4. Create an unordered list (<ul>) with 3 bulleted items.`,
            `5. Use <strong> to emphasize key terms inside the list items.`,
            `6. Add an image (<img>) with a descriptive alt attribute.`,
            `7. Embed a hyperlink (<a>) opening in a new tab using target="_blank".`,
            `8. Construct an ordered list (<ol>) showing a 3-step usage process.`,
            `9. Add a blockquote (<blockquote>) featuring a quote about ${randomTopic}.`,
            `10. Include an <h3> subheader for a secondary information group.`,
            `11. Add an inline code snippet using the <code> tag.`,
            `12. Wrap your primary content blocks inside a <div> container.`,
            `13. Add a horizontal rule (<hr>) to visually separate sections.`,
            `14. Create a footer element (<footer>) with small text (<small>).`,
            `15. Add a mailto link (<a href="mailto:...">) for support inquiries.`
        ],
        1: [
            `1. Structure document root using semantic <header>, <main>, and <footer> tags.`,
            `2. Create a top navigation bar (<nav>) with 3 internal anchor links.`,
            `3. Add a hero banner inside <main> containing an <h1> and lead paragraph.`,
            `4. Construct a content section (<section>) with an <h2> title.`,
            `5. Add 3 content cards using independent <article> tags.`,
            `6. Insert an image inside a <figure> container with a <figcaption>.`,
            `7. Add a sidebar (<aside>) containing auxiliary links or notes.`,
            `8. Build a basic user input form (<form>) with an action attribute.`,
            `9. Add a labeled text input (<label> and <input type="text">).`,
            `10. Include an email input field with the required attribute enabled.`,
            `11. Add a select dropdown (<select>) with at least 3 <option> tags.`,
            `12. Add a submit button (<button type="submit">) inside the form.`,
            `13. Create a data table (<table>) with <thead> and <tbody> sections.`,
            `14. Assign unique id attributes (#hero, #features) for anchor navigation.`,
            `15. Complete the <footer> with dynamic copyright and privacy policy links.`
        ],
        2: [
            `1. Initialize semantic structure (<header>, <nav>, <main>, <article>, <aside>, <footer>).`,
            `2. Build a header featuring a brand title logo and main nav list.`,
            `3. Create a hero section with primary heading, description, and action button.`,
            `4. Build a feature grid section containing 4 semantic <article> cards.`,
            `5. Insert responsive image element configurations using alt and loading attributes.`,
            `6. Construct a multi-column stats block using flexible container elements.`,
            `7. Build an interactive form wrapped inside a <fieldset> with a <legend>.`,
            `8. Add text, email, and tel input types with custom placeholder text.`,
            `9. Implement a multi-line message area using a <textarea> element.`,
            `10. Add a checkbox selection group with corresponding interactive <label> tags.`,
            `11. Include an embedded video/media container using <video> or <iframe> tags.`,
            `12. Create a pricing or specification table using <thead>, <tbody>, and <tfoot>.`,
            `13. Use <th> elements with scope attributes for accessible table headers.`,
            `14. Add section jump anchors with matching target id attributes.`,
            `15. Assemble a footer containing site maps, social links, and legal meta details.`
        ],
        3: [
            `1. Architect a production-ready application layout using full HTML5 semantics.`,
            `2. Construct a sticky navigation header with branding, nav links, and CTA button.`,
            `3. Build a high-converting hero layout with badge elements, <h1>, text, and button group.`,
            `4. Create a main workspace divided into dynamic article feeds and a contextual <aside>.`,
            `5. Implement an accessible card list with headings, descriptions, and tag labels.`,
            `6. Build a complete registration form with client-side pattern validation attributes.`,
            `7. Add radio button groups for plan selection with linked <label> targets.`,
            `8. Include date/time inputs (<input type="date">) with range min/max constraints.`,
            `9. Implement interactive disclosure components using <details> and <summary>.`,
            `10. Create a complex feature comparison table using colspan/rowspan attributes.`,
            `11. Embed responsive picture markup using <picture> and multiple <source> tags.`,
            `12. Add accessible ARIA attributes (aria-label, role) to key interactive elements.`,
            `13. Implement breadcrumb navigation using ordered lists and microdata placeholders.`,
            `14. Ensure complete heading hierarchy validation from <h1> sequentially through <h4>.`,
            `15. Polish page footer with multi-column site links, newsletter signup, and copyright info.`
        ]
    };

    const tasks = levelTasks[Math.min(level, 3)] || levelTasks[0];

    return {
        id: `ai-html-${level}-${timeSeed}`,
        level: level,
        title: `✨ AI: ${randomTopic}`,
        description: `Progressive HTML Challenge Level ${level + 1}. Complete all 15 tasks sequentially.`,
        tasks: tasks,
        solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${randomTopic}</title>
</head>
<body>
  <header>
    <h1>${randomTopic}</h1>
    <nav>
      <a href="#hero">Home</a>
      <a href="#features">Features</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  <main>
    <section id="hero">
      <h2>Welcome to ${randomTopic}</h2>
      <p>Explore high-quality solutions built for modern web experiences.</p>
      <a href="#contact" target="_blank">Get Started</a>
    </section>
    <section id="features">
      <h2>Key Features</h2>
      <ul>
        <li><strong>Interactive</strong> Interface Design</li>
        <li><strong>Accessible</strong> HTML Markup</li>
        <li><strong>Optimized</strong> Performance</li>
      </ul>
      <h3>Usage Steps</h3>
      <ol>
        <li>Review the layout.</li>
        <li>Complete your tasks.</li>
        <li>Test accessibility.</li>
      </ol>
    </section>
    <aside>
      <h3>Quick Notice</h3>
      <p>Check back weekly for new updates.</p>
    </aside>
    <section id="contact">
      <h2>Get In Touch</h2>
      <form action="#" method="POST">
        <label for="email">Email Address:</label>
        <input type="email" id="email" required placeholder="Enter your email" />
        <button type="submit">Submit Request</button>
      </form>
    </section>
  </main>
  <footer>
    <p><small>© ${new Date().getFullYear()} ${randomTopic}. All rights reserved.</small></p>
  </footer>
</body>
</html>`
    };
}

function generateAiCssChallenge(levelIndex = 0) {
    const cssTopics = [
        {
            title: '✨ AI: Enterprise Dashboard Card',
            description: 'Style a dynamic data card using grid systems, dark mode palettes, status badges, and interactive micro-animations.',
            tasks: [
                '1. Apply `box-sizing: border-box` globally across all elements.',
                '2. Set maximum width and horizontally center the card container on screen.',
                '3. Define a dark background color with smooth border radius rounding.',
                '4. Apply multi-layered `box-shadow` elevation for realistic depth.',
                '5. Implement a Flexbox column layout inside the card body.',
                '6. Control vertical spacing between components using the `gap` property.',
                '7. Format the title typography with custom size, font weight, and letter spacing.',
                '8. Mute body description text using sub-headline color contrast.',
                '9. Style a status pill badge using `inline-flex`, padding, and `border-radius: 999px`.',
                '10. Build a 2-column key metric grid using CSS Grid (`grid-template-columns`).',
                '11. Highlight numeric data points with distinct accent colors.',
                '12. Create a primary CTA button with zeroed borders and gradient fill.',
                '13. Add state micro-interactions on hover (`:hover`) using smooth `transform` scaling.',
                '14. Configure active press states using `transform: scale(0.98)`.',
                '15. Include a media query (`@media`) adjusting container padding for narrow mobile screens.'
            ],
            preview: `
      <div class="dash-card">
        <div class="badge">Active System</div>
        <h2>Analytics Overview</h2>
        <p>Real-time telemetry and network traffic analysis.</p>
        <div class="metrics">
          <div><strong>99.9%</strong><span>Uptime</span></div>
          <div><strong>24ms</strong><span>Latency</span></div>
        </div>
        <button class="action-btn">View Live Data</button>
      </div>`,
            solution: `* {
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #0b0f19;
  font-family: system-ui, -apple-system, sans-serif;
}

.dash-card {
  max-width: 360px;
  width: 100%;
  background: #151c2c;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.dash-card h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.dash-card p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.5;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: #0f172a;
  padding: 12px;
  border-radius: 8px;
}

.metrics strong {
  display: block;
  font-size: 1.25rem;
  color: #34d399;
}

.metrics span {
  font-size: 0.75rem;
  color: #64748b;
}

.action-btn {
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .dash-card {
    padding: 16px;
  }
}`
        },
        {
            title: '✨ AI: Interactive Pricing Card',
            description: 'Style a SaaS pricing plan card featuring floating banners, feature checklists, custom buttons, and border highlight glows.',
            tasks: [
                '1. Apply CSS reset rules to eliminate default body margins.',
                '2. Center content both vertically and horizontally in the viewport using Flexbox.',
                '3. Set card positioning to relative (`position: relative`) for absolute child placement.',
                '4. Add a top accent border tag using absolute positioning (`position: absolute`).',
                '5. Style subscription pricing typography using font sizes greater than `2.5rem`.',
                '6. Attach secondary billing frequency labels directly alongside the price tag.',
                '7. Construct a feature list resetting default list style icons (`list-style: none`).',
                '8. Space feature list items evenly using flex layout or inline padding.',
                '9. Add custom pseudo-element (`::before`) checkmarks beside feature items.',
                '10. Dim unavailable or inactive features using custom opacity values.',
                '11. Style a call-to-action button with full container width (`width: 100%`).',
                '12. Apply a glowing outer shadow on hover using `box-shadow`.',
                '13. Set CSS smooth transition curves (`transition: all 0.3s ease`).',
                '14. Highlight the entire card with a prominent border gradient or color focus.',
                '15. Add responsive width constraints (`max-width: 320px`) for mobile viewports.'
            ],
            preview: `
      <div class="pricing-card">
        <div class="popular-tag">Most Popular</div>
        <h3>Pro Plan</h3>
        <div class="price">$29<span>/mo</span></div>
        <ul class="features">
          <li>Unlimited Projects</li>
          <li>Advanced Analytics</li>
          <li>Dedicated Support</li>
        </ul>
        <button class="plan-btn">Upgrade Now</button>
      </div>`,
            solution: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f172a;
  font-family: system-ui, sans-serif;
}

.pricing-card {
  position: relative;
  width: 100%;
  max-width: 320px;
  background: #1e293b;
  border: 2px solid #3b82f6;
  border-radius: 20px;
  padding: 32px 24px 24px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.popular-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: #ffffff;
  padding: 4px 16px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.pricing-card h3 {
  color: #f8fafc;
  margin: 0 0 12px;
}

.price {
  font-size: 2.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 20px;
}

.price span {
  font-size: 1rem;
  color: #94a3b8;
  font-weight: 400;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  text-align: left;
}

.features li {
  color: #cbd5e1;
  padding: 8px 0;
  font-size: 0.9rem;
}

.features li::before {
  content: "✓ ";
  color: #3b82f6;
  font-weight: bold;
}

.plan-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-btn:hover {
  background: #2563eb;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}`
        },
        {
            title: '✨ AI: Glassmorphism Profile Card',
            description: 'Design a modern profile card utilizing background blur filters, semi-transparent overlays, and rounded avatars.',
            tasks: [
                '1. Create a vibrant gradient background for the body element.',
                '2. Apply `backdrop-filter: blur()` to produce a glass effect on the card body.',
                '3. Set a semi-transparent white background using `rgba(255, 255, 255, 0.1)`.',
                '4. Add a subtle 1px translucent border (`border: 1px solid rgba(255,255,255,0.2)`).',
                '5. Center the profile avatar photo horizontally inside the container.',
                '6. Clip avatar images into perfect circles using `border-radius: 50%`.',
                '7. Add a glowing avatar ring using outline or offset border properties.',
                '8. Format user name headings with bold text and white contrast colors.',
                '9. Add user title/role text with reduced font weight.',
                '10. Construct a social statistics row using Flexbox space-between distribution.',
                '11. Divide stat items with subtle vertical borders or subtle gaps.',
                '12. Style numerical stat values with bold typography.',
                '13. Create follow/message action buttons placed side by side in a flexible row.',
                '14. Add hover effects that increase glass background opacity.',
                '15. Constrain card dimensions across viewport sizes using max-width rules.'
            ],
            preview: `
      <div class="glass-card">
        <div class="avatar-wrap">
          <div class="avatar">JS</div>
        </div>
        <h2>Alex Morgan</h2>
        <p class="role">UI/UX Designer</p>
        <div class="stats">
          <div><strong>12.4k</strong><span>Followers</span></div>
          <div><strong>450</strong><span>Projects</span></div>
        </div>
        <div class="btn-group">
          <button class="btn-primary">Follow</button>
          <button class="btn-secondary">Message</button>
        </div>
      </div>`,
            solution: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  font-family: system-ui, sans-serif;
}

.glass-card {
  width: 320px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  padding: 28px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}

.avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 1.75rem;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.glass-card h2 {
  margin: 0;
  font-size: 1.3rem;
}

.role {
  margin: 4px 0 20px;
  font-size: 0.85rem;
  opacity: 0.8;
}

.stats {
  display: flex;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.15);
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.stats strong {
  display: block;
  font-size: 1.1rem;
}

.stats span {
  font-size: 0.75rem;
  opacity: 0.75;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: white;
  color: #4f46e5;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}`
        }
    ];

    return cssTopics[Math.floor(Math.random() * cssTopics.length)];
}

const nextProjectBtn = document.getElementById('nextProjectBtn');
const aiGenerateBtn = document.getElementById('aiGenerateBtn');
const submitProjectBtn = document.getElementById('submitProjectBtn');
const openHtmlInVsCodeBtn = document.getElementById('openHtmlInVsCodeBtn');
const revealSolutionBtn = document.getElementById('revealSolutionBtn');
const resetBtn = document.getElementById('resetBtn');
const newCssBtn = document.getElementById('newCssBtn');
const aiGenerateCssBtn = document.getElementById('aiGenerateCssBtn');
const submitCssBtn = document.getElementById('submitCssBtn');
const revealCssBtn = document.getElementById('revealCssBtn');
const openCssInVsCodeBtn = document.getElementById('openCssInVsCodeBtn');

nextProjectBtn?.addEventListener('click', advanceProject);
aiGenerateBtn?.addEventListener('click', () => {
    const currentLevel = getCurrentLevelIndex();
    const newAiProject = generateAiTaskForLevel(currentLevel);

    const levelProjects = getLevelProjects(currentLevel);
    levelProjects.unshift(newAiProject);
    state.currentProjectIndex = 0;
    codeInput.value = '';
    cssCodeInput.value = '';

    solutionBox.classList.remove('visible');
    solutionOutput.textContent = '';
    statusMessage.textContent = `✨ New AI task generated for Level ${currentLevel + 1}!`;
    refreshDashboard();
});

submitProjectBtn?.addEventListener('click', () => {
  const wasSubmitted = awardHtmlXp(getCurrentProject());
  if (wasSubmitted) {
    openCssStylingStep();
  }
});
openHtmlInVsCodeBtn?.addEventListener('click', () => {
  openTaskInVsCode(getCurrentProject(), 'html');
});
revealSolutionBtn?.addEventListener('click', revealHtmlSolution);
resetBtn?.addEventListener('click', resetProgress);

newCssBtn?.addEventListener('click', nextCssChallenge);
aiGenerateCssBtn?.addEventListener('click', () => {
    const currentLevel = getCurrentLevelIndex();
    const newAiChallenge = generateAiCssChallenge(currentLevel);
    cssChallenges.unshift(newAiChallenge);
    currentCssIndex = 0;
    codeInput.value = '';
    cssCodeInput.value = '';
    renderCssChallenge();
    cssStatusMessage.textContent = '✨ New AI CSS Challenge generated!';
});
submitCssBtn?.addEventListener('click', evaluateCssSubmission);
revealCssBtn?.addEventListener('click', revealCssSolution);
openCssInVsCodeBtn?.addEventListener('click', () => {
  const challenge = cssChallenges[currentCssIndex % cssChallenges.length];
  openTaskInVsCode({ ...challenge, level: getCssChallengeLevel(challenge, currentCssIndex % cssChallenges.length) }, 'css');
});

codeInput?.addEventListener('input', () => {
    renderProjectPreview(getCurrentProject());
    renderCssPreview(cssChallenges[currentCssIndex % cssChallenges.length]);
});

cssCodeInput?.addEventListener('input', () => {
    renderProjectPreview(getCurrentProject());
    renderCssPreview(cssChallenges[currentCssIndex % cssChallenges.length]);
});

function isProtectedSolutionVisible() {
  return solutionBox?.classList.contains('protected-solution') || false;
}

function isProtectedSolutionEvent(event) {
  return isProtectedSolutionVisible() && event.target instanceof Element && event.target.closest('#solutionBox');
}

document.addEventListener('contextmenu', (event) => {
  if (isProtectedSolutionEvent(event)) {
    event.preventDefault();
  }
});

document.addEventListener('copy', (event) => {
  if (isProtectedSolutionEvent(event)) {
    event.preventDefault();
  }
});

document.addEventListener('cut', (event) => {
  if (isProtectedSolutionEvent(event)) {
    event.preventDefault();
  }
});

document.addEventListener('dragstart', (event) => {
  if (isProtectedSolutionEvent(event)) {
    event.preventDefault();
  }
});

document.addEventListener('keydown', (event) => {
  if (!isProtectedSolutionEvent(event)) {
    return;
  }

  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && ['c', 's', 'u', 'p'].includes(key)) {
    event.preventDefault();
  }
});

document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
          const page = button.dataset.page;
          if (page === 'profile.html' && !getCurrentUser()) {
            navigateToPage('auth.html');
            return;
          }
          navigateToPage(page);
    });
});

document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', handleAuthToggle);
});

loginForm?.addEventListener('submit', loginUser);
registerForm?.addEventListener('submit', registerUser);
logoutBtn?.addEventListener('click', logoutUser);
document.getElementById('googleLoginBtn')?.addEventListener('click', handleGoogleSignIn);
document.getElementById('googleRegisterBtn')?.addEventListener('click', handleGoogleSignIn);

initFirebaseAuth();
if (cssView) {
  renderCssChallenge();
}
if (dashboardView) {
  refreshDashboard();
}
updateProfileUI();

const savedUser = getCurrentUser();
const pageName = document.body.dataset.page || '';
if (savedUser && authView && pageName === 'auth') {
  navigateToPage('index.html');
} else if (!savedUser && profileView && pageName !== 'auth') {
  navigateToPage('auth.html');
} else if (!savedUser && authView && pageName === 'auth') {
  authView.classList.remove('hidden');
} else if (dashboardView) {
  showView('dashboardView');
  if (!savedUser && statusMessage) {
  statusMessage.textContent = 'Preview ready. Log in to save progress and earn XP.';
  }
}