/* ==========================================================================
   SEED website — content data
   --------------------------------------------------------------------------
   This is the single place to edit most site content. Edit the values below
   (or add / remove entries) and the site updates automatically. No build
   step or backend is required.

   HOW TO EDIT
   - Announcements  -> ANNOUNCEMENTS  (homepage + /announcements.html)
   - Projects       -> PROJECTS       (/projects.html)
   - GreenBox page  -> GREENBOX       (/project-greenbox.html)
   - Events         -> EVENTS         (homepage "Upcoming Events")
   - Contact / social -> CONTACT      (/get-involved.html)

   DATES use the format "YYYY-MM-DD" and are displayed automatically as
   e.g. "October 16, 2026".
   ========================================================================== */

/* Site-wide identity ------------------------------------------------------ */
const SITE = {
  name: "SEED",
  fullName: "The Community of Sustainability, Earth, Education, and Development",
  tagline: "Growing a more sustainable campus, one action at a time.",
  shortSchool: "FDIS", // Film-Development international school abbreviation, used sparingly
};

/* Images -------------------------------------------------------------------
   These are editorial photographs. Replace any URL with your own hosted image
   if you prefer to manage assets locally.
   -------------------------------------------------------------------------- */
const IMAGES = {
  heroForest:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sunlight%20filtering%20through%20a%20dense%20evergreen%20forest%20canopy%20with%20soft%20morning%20mist%20and%20moss%20covered%20ground%20editorial%20nature%20photography%20in%20muted%20forest%20green%20and%20warm%20earthy%20tones&image_size=landscape_16_9",
  campus:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20sustainable%20school%20campus%20courtyard%20with%20young%20trees%20and%20a%20few%20students%20walking%20in%20warm%20natural%20daylight%20editorial%20documentary%20photography&image_size=landscape_4_3",
  education:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Close%20up%20of%20student%20hands%20planting%20a%20young%20seedling%20in%20rich%20dark%20soil%20in%20a%20school%20garden%20under%20soft%20natural%20light%20documentary%20photography&image_size=landscape_4_3",
  advocacy:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Small%20group%20of%20students%20discussing%20around%20a%20wooden%20table%20with%20potted%20plants%20and%20reusable%20cups%20in%20bright%20natural%20light%20editorial%20documentary%20photography&image_size=landscape_4_3",
  notebooks:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Neat%20stack%20of%20kraft%20paper%20and%20blank%20notebooks%20on%20a%20wooden%20desk%20beside%20a%20wooden%20pencil%20in%20warm%20natural%20window%20light%20minimal%20editorial%20still%20life%20photography&image_size=landscape_4_3",
  greenboxStation:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wooden%20box%20with%20neatly%20stacked%20donated%20notebooks%20on%20a%20table%20suggesting%20reuse%20and%20exchange%20under%20warm%20natural%20light%20editorial%20product%20photography&image_size=landscape_4_3",
  community:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Diverse%20group%20of%20students%20collaborating%20outdoors%20in%20a%20school%20garden%20candid%20documentary%20photography%20in%20soft%20natural%20light&image_size=landscape_16_9",
};

/* Navigation ---------------------------------------------------------------
   "Get Involved" is a highlighted button and is defined separately in the
   header markup of each page.
   -------------------------------------------------------------------------- */
const NAV_LINKS = [
  { label: "Home", href: "index.html" },
  { label: "Announcements", href: "announcements.html" },
  { label: "Projects", href: "projects.html" },
  { label: "About", href: "about.html" },
];

const CTA_LINK = { label: "Get Involved", href: "get-involved.html" };

/* Announcements ------------------------------------------------------------
   Category can be one of: General, Events, Projects, Opportunities.
   - "featured: true" pins the item to the top of the announcements page.
   - "sample: true" shows a small "Sample" label (for placeholder posts only).
   -------------------------------------------------------------------------- */
const ANNOUNCEMENTS = [
  {
    id: "greenbox-solution-design",
    title: "GreenBox moves into Solution Design",
    category: "Projects",
    date: "2026-10-16",
    summary:
      "Following the completion of our student survey, the GreenBox team is now exploring two possible approaches to reduce unused notebooks and make better use of campus resources.",
    cover: IMAGES.greenboxStation,
    featured: true,
    content: [
      "The GreenBox project has entered its Solution Design stage. Building on feedback collected through our student survey, the team is now considering two possible approaches: adjusting the number of notebooks distributed each semester, and introducing a proposed on-campus GreenBox Station for exchanging unused notebooks.",
      "Both ideas are still proposals under consideration. No changes to the school's notebook distribution have been approved, and the GreenBox Station is not yet installed.",
      "We will share further updates as the team finalises its design. In the meantime, you can follow the project's progress on its dedicated page.",
    ],
  },
  {
    id: "greenbox-survey-results",
    title: "GreenBox survey findings: 38 responses collected",
    category: "Projects",
    date: "2026-10-15",
    summary:
      "Our survey on notebook usage has closed with 38 valid responses. Here is a summary of what students told us about the notebooks they receive and use.",
    cover: IMAGES.notebooks,
    content: [
      "The GreenBox survey ran from September 15 to September 19, 2026, and received 38 valid responses — 18 from high school and 20 from middle school students.",
      "On average, respondents reported 4.51 spare notebooks per semester, with high school students reporting a higher average (5.18) than middle school students (3.95). The most common way of dealing with unused notebooks was simply keeping them unused.",
      "These results reflect the 38 valid survey responses only and are not a definitive measurement of the whole school. They help the team understand whether unused notebooks are a meaningful issue and inform potential solutions.",
    ],
  },
  {
    id: "greenbox-survey-launch",
    title: "GreenBox opens a student survey on notebook use",
    category: "Projects",
    date: "2026-09-14",
    summary:
      "GreenBox has launched a short survey to understand how students use the school-provided notebooks they receive each semester.",
    cover: IMAGES.campus,
    content: [
      "GreenBox, SEED's first project, has opened a student survey to learn more about how students use the school-provided notebooks they receive each semester.",
      "The survey ran on Wenjuanxin from September 15 to September 19, 2026. Responses are voluntary, and any response without consent for the intended use of the data was removed immediately.",
      "The results will help the team decide what practical steps, if any, could reduce unnecessary notebook distribution and extend the use of existing notebooks.",
    ],
  },
  {
    id: "join-seed-committee",
    title: "Project members wanted",
    category: "Opportunities",
    date: "2026-10-02",
    summary:
      "SEED is a student-led community of project leaders and members. We are looking for students who want to turn sustainability ideas into action.",
    sample: true,
    content: [
      "This is a sample announcement to demonstrate the layout. Replace it with a real call for members when the committee is ready to open recruitment.",
      "SEED projects are led by student project leaders and supported by project members. If you are interested in getting involved, visit the Get Involved page — or simply talk to a current SEED member.",
    ],
  },
  {
    id: "term-kickoff",
    title: "Term kickoff meeting",
    category: "Events",
    date: "2026-09-05",
    summary:
      "A sample post to demonstrate the events category. Replace this with details of your next club meeting once it is scheduled.",
    sample: true,
    content: [
      "This is a sample announcement. Update the title, date, and summary with the details of your next club meeting.",
      "Regular club meetings are where ideas are shared, projects are planned, and members coordinate upcoming initiatives.",
    ],
  },
  {
    id: "welcome-to-seed",
    title: "Welcome to SEED",
    category: "General",
    date: "2026-08-31",
    summary:
      "Introducing SEED — The Community of Sustainability, Earth, Education, and Development, and what we hope to grow together this year.",
    sample: true,
    content: [
      "This is a sample welcome post. Use it to introduce new members to the club's mission and how to take part.",
      "SEED exists to promote sustainability on campus, raise environmental awareness, advocate for environmentally beneficial policies and events, and coordinate student-led projects.",
    ],
  },
];

/* Upcoming events ----------------------------------------------------------
   Leave EVENTS empty ( [] ) to show the graceful “no events” state.
   To publish an event, add an object like the commented example below.
   Never invent dates or registration links — only add real, confirmed events.
   -------------------------------------------------------------------------- */
const EVENTS = [];

/* EXAMPLE EVENT (uncomment and edit to publish):
{
  id: "example-event",
  title: "Example: Campus clean-up afternoon",
  date: "2026-11-01",
  time: "16:00 – 17:30",
  location: "Meet at the main courtyard",
  description: "Example description of the event.",
  registerLink: null, // e.g. "https://forms.example.com/signup" or null
}
*/

/* Projects -----------------------------------------------------------------
   Each project belongs to a `category` of "upcoming" or "past". The category
   (not the status) decides which list it appears in on the Projects page.

   Field reference:
   - projectNumber  : display number, e.g. "01"
   - name           : project name
   - description    : short public description
   - category       : "upcoming" or "past"
   - status         : e.g. "Solution Design", "In Progress", or "Completed"
   - lastUpdated    : "YYYY-MM-DD" (upcoming projects)
   - completionDate : "YYYY-MM-DD" (past projects, optional)
   - outcomes       : short summary of actual outcomes (past projects)
   - image          : cover image
   - detailPage     : relative link to the project's detail page (optional)

   To mark a project as completed, set category: "past", add a completionDate
   and an outcomes summary. GreenBox stays in "upcoming" until it is finished.
   -------------------------------------------------------------------------- */
const PROJECTS = [
  {
    projectNumber: "01",
    name: "GreenBox",
    category: "upcoming",
    status: "Solution Design",
    tagline: "Rethinking how our campus uses school-provided notebooks.",
    description:
      "GreenBox investigates the problem of unused school-provided notebooks at FDIS and explores practical ways to improve resource efficiency through more appropriate distribution and a proposed notebook exchange station.",
    lastUpdated: "2026-10-15",
    image: IMAGES.greenboxStation,
    detailPage: "project-greenbox.html",
  },
];

/* GreenBox — detailed project page data -----------------------------------
   All of the facts below come from the project brief. Update statuses,
   milestones, and team information here as the project develops.
   -------------------------------------------------------------------------- */
const GREENBOX = {
  name: "GreenBox",
  number: "#01",
  status: "Solution Design",
  statusIsCurrent: true,
  initiated: "August 31, 2026",
  lastUpdated: "October 15, 2026",

  // Team names are shown publicly only when PUBLISH_TEAM_NAMES is true.
  PUBLISH_TEAM_NAMES: false,
  teamNames: ["Emma Umemura", "Harry Liang", "Henry Cai", "Mira Zhao"],
  teamPlaceholder: "SEED Project Team",

  overview: [
    "At FDIS, each student receives 10 school-provided notebooks every semester, each containing 30 pages of JIS B5 paper. However, our preliminary observations suggested that many students do not use all the notebooks they receive. Some prefer digital notes or their own notebooks, while others only need school-provided notebooks for selected subjects.",
    "GreenBox was initiated to investigate this potential mismatch between notebook distribution and actual student needs. Through student surveys and solution design, the project aims to explore practical ways to reduce unnecessary distribution, extend the use of existing notebooks, and improve the efficiency of campus resource use.",
    "GreenBox is an ongoing student-led initiative. Its proposed solutions have not yet been finalised or implemented, and no change to the school's notebook distribution policy has been approved.",
  ],

  problem: [
    "Each student receives 10 school-provided notebooks per semester. Our preliminary observations suggested that many students do not use every notebook they receive — some rely on digital notes or their own notebooks, and others only need school-provided notebooks for a few subjects.",
    "GreenBox set out to test whether unused notebooks were a meaningful issue at FDIS, and to gather the information needed to shape practical solutions.",
  ],

  // Survey & findings
  survey: {
    statusLabel: "Survey completed",
    window: "Conducted via Wenjuanxin from September 15, 2026, 10:00 to September 19, 2026, 18:00.",
    totalResponses: 38,
    highSchool: 18,
    middleSchool: 20,
    note:
      "Responses without participant consent for the intended use of the data were deleted immediately. Results reflect the 38 valid survey responses — they are not a definitive measurement of the entire school population.",
    table: [
      { measure: "Mean spare notebooks per semester", overall: "4.51", high: "5.18", middle: "3.95" },
      { measure: "Median spare notebooks per semester", overall: "4", high: "4.5", middle: "4" },
      { measure: "Most common reported disposal method", overall: "Kept unused", high: "—", middle: "—" },
    ],
    chart: {
      label: "Mean spare notebooks per student per semester",
      data: [
        { name: "Overall", value: 4.51 },
        { name: "High school", value: 5.18 },
        { name: "Middle school", value: 3.95 },
      ],
    },
    observations: [
      "Many high school students primarily use digital notes, relying on physical notebooks for handwritten homework and scratch work.",
      "Middle school students generally reported using physical notebooks more frequently than high school students, but their estimated annual needs also appeared lower than the number distributed.",
    ],
  },

  // Proposed solutions
  solutionsIntro:
    "The team is currently exploring two possible approaches. Both remain proposals under consideration — neither has been approved or implemented.",
  solutions: [
    {
      letter: "A",
      title: "Adjust Notebook Distribution",
      status: "Proposed",
      body: [
        "Potential changes to the number of notebooks distributed each semester include:",
        "High school — reducing distribution from 10 to 5 notebooks per student per semester.",
        "Middle school — reducing distribution from 10 to 5 notebooks per student for the second semester.",
      ],
      note: "These are proposals under consideration, not approved school policies.",
    },
    {
      letter: "B",
      title: "GreenBox Station",
      status: "Proposed",
      body: [
        "A proposed on-campus notebook exchange or collection station would allow students to contribute unused school-provided notebooks, and allow students who need additional notebooks to obtain them.",
        "The concept is to make better use of existing resources before distributing additional ones.",
      ],
      note: "The GreenBox Station is a proposed solution. It is not an existing installation and is not operational.",
    },
  ],

  // Timeline / phases
  phases: [
    {
      key: "Phase 1",
      title: "Investigation",
      statusLabel: "Survey completed",
      state: "done",
      body: "The investigation was designed to determine whether unused notebooks were a meaningful issue at FDIS and to inform potential solutions. The student survey closed with 38 valid responses.",
    },
    {
      key: "Phase 2",
      title: "Design of Solutions",
      statusLabel: "Under development",
      state: "current",
      body: "The team is exploring two possible approaches: adjusting notebook distribution and a proposed on-campus GreenBox Station.",
    },
    {
      key: "Phase 3",
      title: "Implementation",
      statusLabel: "Not yet started",
      state: "upcoming",
      body: "The implementation plan has not yet been established.",
    },
    {
      key: "Phase 4",
      title: "Management and Evaluation",
      statusLabel: "Not yet defined",
      state: "upcoming",
      body: "Long-term management, measurement methods, and evaluation criteria have not yet been finalised.",
    },
  ],

  updatesIntro:
    "Further announcements about GreenBox will be published on the SEED announcements page as the project develops.",
};

/* Contact / social placeholders -------------------------------------------
   Replace the placeholder strings below with real contact details when they
   are available. Leave any field as null to show a labeled placeholder.
   -------------------------------------------------------------------------- */
const CONTACT = {
  email: null,        // e.g. "seed@example.com"
  instagram: null,    // e.g. "seed.fdis"
  interestFormUrl: null, // e.g. "https://forms.example.com/interest"
  eventRegisterUrl: null, // e.g. "https://forms.example.com/events"
};