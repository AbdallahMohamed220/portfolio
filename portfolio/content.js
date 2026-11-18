/*
 * Portfolio content — the ONLY file you need to edit to change the site's text,
 * links and images.
 *
 * Structure:
 *   window.PORTFOLIO_CONTENT = {
 *     shared: { ... }   // values that are the same in every language (URLs, image paths)
 *     en:     { ... }   // English text
 *     ar:     { ... }   // Arabic text (must have exactly the same keys as `en`)
 *   }
 *
 * Rules:
 *   - Keep the keys of `en` and `ar` identical; only change the text values.
 *   - Items are matched by `id`: every item in `<lang>.projects.items`,
 *     `<lang>.experience.items` and `<lang>.certificates.items` needs an entry
 *     with the same `id` in `shared.projects`, `shared.experience` and
 *     `shared.certificates` (which hold the URLs and images).
 *   - A project's `challenge` is optional: give it in every language or in none.
 *   - A project's `contributions` may be an empty list; its block is then hidden.
 *   - A store URL set to null hides that store's button. It is null when the
 *     CV has no link, or when the listing is dead (see
 *     docs/project-store-icons/dead-links.json). With both null, the card has
 *     no store row.
 *   - Image paths are relative to index.html (e.g. "assets/avatar.jpg").
 *   - `shared.links.email` is a plain address (the page adds "mailto:") and
 *     `shared.links.phone` is the international number (the page adds "tel:").
 *   - App, company and technology names stay in Latin script in every language.
 *
 * This is a plain script (no modules, no fetch) so the site works when
 * index.html is opened directly from disk (file://).
 */
window.PORTFOLIO_CONTENT = {
  shared: {
    defaultLang: "en",
    links: {
      email: "Dev.Fluttery@gmail.com",
      phone: "+201147234230",
      github: "https://github.com/AbdallahMohamed220",
      linkedin: "https://www.linkedin.com/in/abdallah-mohamed-%F0%9F%87%B5%F0%9F%87%B8-0b4270183/",
      stackoverflow: "https://shorturl.at/QYQxr",
      cv: "assets/cv.pdf"
    },
    images: {
      avatar: "assets/avatar.jpg"
    },
    projects: [
      {
        id: "alriyadh-app",
        image: "assets/project-alriyadh-app-icon.png",
        googlePlayUrl: "https://shorturl.at/wDSsL",
        appStoreUrl: "https://shorturl.at/xli1x"
      },
      {
        id: "waste-transportation-request",
        image: "assets/project-waste-transportation-request-icon.png",
        googlePlayUrl: "https://shorturl.at/9RvLv",
        appStoreUrl: "https://shorturl.at/S4dpi"
      },
      {
        id: "taher",
        image: "assets/project-taher.svg",
        googlePlayUrl: null,
        appStoreUrl: null
      },
      {
        id: "home-experience",
        image: "assets/project-home-experience-icon.png",
        googlePlayUrl: null,
        appStoreUrl: "https://t.ly/BkTG9"
      },
      {
        id: "fix-infinity",
        image: "assets/project-fix-infinity.svg",
        googlePlayUrl: null,
        appStoreUrl: null
      },
      {
        id: "alwsata-employees",
        image: "assets/project-alwsata-employees-icon.png",
        googlePlayUrl: "https://tinyurl.com/bdd9vks7",
        appStoreUrl: null
      },
      {
        id: "alwsata-real-estate",
        image: "assets/project-alwsata-real-estate-icon.jpg",
        googlePlayUrl: "https://tinyurl.com/5n9a232e",
        appStoreUrl: "https://tinyurl.com/atn6h2er"
      },
      {
        id: "al7feaz",
        image: "assets/project-al7feaz.svg",
        googlePlayUrl: null,
        appStoreUrl: null
      },
      {
        id: "doctorcrypto",
        image: "assets/project-doctorcrypto.svg",
        googlePlayUrl: null,
        appStoreUrl: null
      },
      {
        id: "chkchk",
        image: "assets/project-chkchk.svg",
        googlePlayUrl: null,
        appStoreUrl: null
      },
      {
        id: "messayel",
        image: "assets/project-messayel.svg",
        googlePlayUrl: null,
        appStoreUrl: null
      },
      {
        id: "bedayat",
        image: "assets/project-bedayat-icon.jpg",
        googlePlayUrl: "https://tinyurl.com/5efpshce",
        appStoreUrl: "https://rb.gy/aj2cfi"
      }
    ],
    experience: [
      { id: "evision", companyUrl: "http://www.evision-corp.com/" },
      { id: "alwsata", companyUrl: "https://alwsata.com.sa/" },
      { id: "csskw", companyUrl: "https://csskw.net/" },
      { id: "rizme", companyUrl: "https://www.linkedin.com/company/rizme/" }
    ],
    certificates: [
      { id: "clean-code", url: "https://www.udemy.com/certificate/UC-b12d90ac-2661-410f-81fd-2db79b302d5d/" },
      { id: "clean-architecture-flutter", url: "https://www.udemy.com/certificate/UC-106fade0-47f2-4c00-b8fe-ffcbd1f8f21d/" },
      { id: "flutter-bloc", url: "https://www.udemy.com/certificate/UC-290a6f9b-ad53-41ee-bcfd-d76678f50801/" },
      { id: "flutter-dart-2022", url: "https://www.udemy.com/certificate/UC-d36684a5-c59f-48f8-9bb9-5529f6ba978e/" },
      { id: "dart-novice-expert", url: "https://www.udemy.com/certificate/UC-67e2f920-11de-43a8-a8d1-425d413efaed/" },
      { id: "flutter-dart-guide-2023", url: "https://www.udemy.com/certificate/UC-e8b27876-9a9d-4def-b1bf-dd4208161683/" }
    ]
  },

  en: {
    meta: {
      lang: "en",
      dir: "ltr",
      title: "Abdallah Mohamed — Mobile Developer (Flutter)",
      description: "Portfolio of Abdallah Mohamed, a Flutter mobile developer in Cairo: 12 apps, skills, experience, certificates and contact details."
    },
    nav: {
      label: "Main navigation",
      about: "About",
      projects: "Projects",
      skills: "Skills & Experience",
      contact: "Contact"
    },
    ui: {
      skipLink: "Skip to content",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      themeToDark: "Switch to dark theme",
      themeToLight: "Switch to light theme",
      langToggle: "العربية",
      langToggleLabel: "العربية – عرض الموقع باللغة العربية",
      downloadCv: "Download CV",
      projectDetails: "More details",
      keyContributions: "Key contributions",
      keyChallenge: "Key challenge",
      googlePlay: "Google Play",
      appStore: "App Store"
    },
    hero: {
      greeting: "Hello, I'm",
      name: "Abdallah Mohamed",
      role: "Mobile Developer",
      location: "Cairo, Egypt",
      tagline: "I build cross-platform mobile apps with Flutter, from the first screen to the Google Play and App Store release.",
      avatarAlt: "Abdallah Mohamed smiling, wearing glasses and a navy striped sweater",
      ctaProjects: "View my work",
      ctaContact: "Get in touch"
    },
    about: {
      title: "About me",
      paragraphs: [
        "Dedicated and results-driven Flutter developer with a proven track record of designing, implementing, testing, and maintaining complex applications within diverse industries. Over the past 5 years, I have honed my skills in crafting seamless user interfaces and robust functionalities using the Flutter framework. My commitment to staying abreast of the latest technologies, coupled with a passion for creating engaging user experiences, sets me apart in the dynamic field of mobile app development."
      ]
    },
    projects: {
      title: "Projects",
      intro: "Twelve Flutter apps I have worked on, newest first, with links to their store pages.",
      items: [
        {
          id: "alriyadh-app",
          title: "Alriyadh App",
          period: "09/2025 – 11/2025",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "The Al Riyadh Waste Management System is a comprehensive platform tailored to enhance waste management operations in Al Riyadh, with features designed for real-time tracking, playback and service charts.",
          contributions: [
            "Maps (markers, polyline drawing)",
            "Charts"
          ],
          imageAlt: "Alriyadh App icon"
        },
        {
          id: "waste-transportation-request",
          title: "Waste Transportation Request",
          period: "01/2025 – 03/2025",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "Waste Transportation Request is an app with two user types: an admin/advisor who can add requests, and a driver who receives a notification for each request, accepts it, views it on the map, opens the map to navigate to it, and completes the request by attaching an image.",
          contributions: [
            "Notifications in foreground, background and terminated (killed) app states",
            "Google Maps and in-app navigation",
            "Built the UI",
            "Integrated RESTful APIs",
            "Deployed the app"
          ],
          imageAlt: "Waste Transportation Request icon"
        },
        {
          id: "taher",
          title: "Taher",
          period: "02/2024 – 05/2024",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "Taher, built with E.VISION, manages waste complaints in Saudi Arabia: an administrator can log in, add a complaint and follow its status.",
          contributions: [
            "Offline mode: an administrator can save a complaint locally and upload it to the server once back online",
            "Built the UI",
            "Integrated RESTful APIs",
            "Deployed the app"
          ],
          imageAlt: "Taher icon"
        },
        {
          id: "home-experience",
          title: "Home Experience",
          period: "06/2023 – 09/2023",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "A user-friendly app for furniture sales, focusing on seamless e-commerce integration and an intuitive interface.",
          contributions: [
            "Deep linking with GoRouter",
            "Built the UI",
            "Integrated RESTful APIs",
            "Handled notifications",
            "Deployed the app"
          ],
          imageAlt: "Home Experience icon"
        },
        {
          id: "fix-infinity",
          title: "Fix Infinity",
          period: "03/2023 – 06/2023",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "An app focused on electronic device repairs and product sales.",
          contributions: [
            "Built the UI",
            "Integrated RESTful APIs",
            "Handled notifications",
            "Deployed the app"
          ],
          challenge: "Using Pusher to handle real-time chat.",
          imageAlt: "Fix Infinity icon"
        },
        {
          id: "alwsata-employees",
          title: "Alwsata Real Estate Employees",
          period: "05/2022 – present",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "An app that provides accounts for Alwsata Real Estate employees to facilitate their work with the Alwsata system.",
          contributions: [
            "Built part of the UI",
            "Integrated RESTful APIs"
          ],
          imageAlt: "Alwsata Real Estate Employees icon"
        },
        {
          id: "alwsata-real-estate",
          title: "Alwsata Real Estate Co",
          period: "05/2022 – present",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "An app that simplifies the complexities of real estate transactions by offering intuitive financial tools. Users can effortlessly navigate mortgage calculations, explore financing options and deal with their own advisor.",
          contributions: [
            "Built part of the UI",
            "Integrated RESTful APIs"
          ],
          imageAlt: "Alwsata Real Estate Co icon"
        },
        {
          id: "al7feaz",
          title: "Al7feaz",
          period: "03/2022 – 05/2022",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "A user-friendly mobile app designed for seamless product transactions. With a focus on simplicity, the app allows users to effortlessly sell products, generate invoices for customers and streamline the checkout process. Al7feaz also features convenient QR code scanning, enhancing the efficiency of transactions.",
          contributions: [
            "Built the UI",
            "Integrated RESTful APIs",
            "Handled QR code scanning",
            "Deployed the app"
          ],
          imageAlt: "Al7feaz icon"
        },
        {
          id: "doctorcrypto",
          title: "DoctorCrypto",
          period: "01/2022 – 03/2022",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "This app is designed to provide personalized recommendations tailored to your crypto investment goals. Whether you're a seasoned investor or just starting, DoctorCrypto analyzes market trends and your preferences to offer clear, actionable suggestions. Stay informed, make informed decisions.",
          contributions: [
            "Built the UI",
            "Integrated with Firebase",
            "Handled free and premium accounts",
            "Deployed the app"
          ],
          imageAlt: "DoctorCrypto icon"
        },
        {
          id: "chkchk",
          title: "ChkChk",
          period: "11/2021 – 12/2021",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "ChkChk is a versatile e-commerce app designed for simplicity and practicality. It allows users to effortlessly browse and purchase a variety of products. What sets ChkChk apart is its unique capability to facilitate orders for sending packages to others. The app also features a real-time map, providing users with live updates on the status and location of their orders and deliveries.",
          contributions: [
            "Built the UI",
            "Integrated RESTful APIs",
            "Handled notifications",
            "Deployed the app"
          ],
          challenge: "Working with Google Maps and handling real-time location.",
          imageAlt: "ChkChk icon"
        },
        {
          id: "messayel",
          title: "Messayel",
          period: "10/2021 – 11/2021",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "Messayel is an app tailored for aspiring knights and horse enthusiasts. This unique platform connects users with trusted trainers and provides a dedicated space for scheduling horse riding lessons. With a built-in store, Messayel also offers a curated selection of knighthood essentials, from rider helmets to specialized tools. It's your gateway to an authentic knighthood experience, bringing together training, equipment and the spirit of chivalry in one convenient app.",
          contributions: [
            "Built the UI",
            "Integrated RESTful APIs",
            "Handled notifications",
            "Deployed the app"
          ],
          challenge: "Integrating the Tap payment gateway to handle payments.",
          imageAlt: "Messayel icon"
        },
        {
          id: "bedayat",
          title: "Bedayat",
          period: "08/2021 – 09/2021",
          role: "Mobile Developer",
          tech: "Flutter",
          description: "Bedayat is the go-to app for parents with children in kindergarten. Stay connected with your child's day in real time, from their arrival through the kindergarten gate to daily activities like meals. With personalized accounts for each child, Bedayat keeps you informed and engaged, letting you care for your little one with ease. It's your window into your child's daily adventures and a convenient tool for ensuring their well-being at every step.",
          contributions: [],
          imageAlt: "Bedayat icon"
        }
      ]
    },
    skills: {
      title: "Skills & Experience",
      skillsTitle: "Skills",
      items: [
        { name: "Flutter", description: "Proficient in building cross-platform mobile applications using the Flutter framework." },
        { name: "Dart", description: "Strong command of Dart, the language used for Flutter app development." },
        { name: "State Management", description: "Knowledge of various state management techniques in Flutter (Provider, BLoC, GetX, Riverpod)." },
        { name: "API Integration", description: "Extensive experience in integrating RESTful APIs and third-party services into Flutter applications." },
        { name: "Firebase", description: "Expertise in using Firebase services for authentication, database and cloud functions." },
        { name: "Local Database", description: "Proficient in implementing and managing local databases using tools like SQLite or Hive." },
        { name: "Version Control", description: "Experience with version control systems, such as Git, for efficient collaboration and code management." },
        { name: "CI/CD", description: "Familiarity with CI/CD pipelines to automate the testing and deployment processes." },
        { name: "Testing", description: "Skilled in writing unit tests and performing widget testing for Flutter applications." },
        { name: "Responsive Design", description: "Ability to create responsive layouts for various screen sizes and orientations." },
        { name: "Performance Optimization", description: "Experience in optimizing app performance for speed and responsiveness." },
        { name: "Debugging & Profiling", description: "Proficient in debugging and using performance profiling tools to identify and resolve issues." }
      ]
    },
    experience: {
      title: "Experience",
      appsLabel: "Apps built",
      items: [
        {
          id: "evision",
          company: "E.VISION for Information Technology",
          role: "Mobile Developer",
          period: "12/2023 – present",
          location: "Cairo",
          apps: ["Alriyadh App", "Waste Transportation Request", "Taher"]
        },
        {
          id: "alwsata",
          company: "Alwsata",
          role: "Mobile Developer",
          period: "08/2022 – present",
          location: "Saudi Arabia",
          apps: ["Alwsata Real Estate Co", "Alwsata Real Estate Employees"]
        },
        {
          id: "csskw",
          company: "Csskw",
          role: "Mobile Developer",
          period: "01/2022 – 07/2022",
          location: "Kuwait",
          apps: ["Al7feaz", "Messayel", "ChkChk"]
        },
        {
          id: "rizme",
          company: "Rizme",
          role: "Mobile Developer",
          period: "05/2021 – 12/2021",
          location: "Egypt",
          apps: ["Bedayat"]
        }
      ]
    },
    education: {
      title: "Education",
      degree: "Computer Science",
      institution: "Faculty of Computers and Information",
      period: "09/2014 – 09/2018"
    },
    certificates: {
      title: "Certificates",
      items: [
        { id: "clean-code", title: "Clean Code" },
        { id: "clean-architecture-flutter", title: "Clean Architecture in Flutter 3 (Arabic)" },
        { id: "flutter-bloc", title: "Flutter BLoC - From Zero to Hero Complete Course" },
        { id: "flutter-dart-2022", title: "The Complete 2022 Flutter & Dart Development Course [Arabic]" },
        { id: "dart-novice-expert", title: "Dart - from Novice to Expert Complete Course" },
        { id: "flutter-dart-guide-2023", title: "Flutter & Dart - The Complete Guide [2023 Edition]" }
      ]
    },
    languages: {
      title: "Languages",
      items: ["Arabic", "English"]
    },
    contact: {
      title: "Contact",
      intro: "Looking for a Flutter developer for your next app? Reach out through any of the channels below.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      phoneDisplay: "+20 114 723 4230",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      stackoverflowLabel: "Stack Overflow"
    },
    footer: {
      text: "© 2026 Abdallah Mohamed. All rights reserved."
    }
  },

  ar: {
    meta: {
      lang: "ar",
      dir: "rtl",
      title: "عبدالله محمد — مطوّر تطبيقات الجوال (Flutter)",
      description: "معرض أعمال عبدالله محمد، مطوّر تطبيقات الجوال بتقنية Flutter في القاهرة: 12 تطبيقًا والمهارات والخبرات والشهادات وطرق التواصل."
    },
    nav: {
      label: "التنقل الرئيسي",
      about: "نبذة عني",
      projects: "المشاريع",
      skills: "المهارات والخبرات",
      contact: "تواصل معي"
    },
    ui: {
      skipLink: "انتقل إلى المحتوى",
      menuOpen: "افتح القائمة",
      menuClose: "أغلق القائمة",
      themeToDark: "التبديل إلى الوضع الداكن",
      themeToLight: "التبديل إلى الوضع الفاتح",
      langToggle: "English",
      langToggleLabel: "English – View the site in English",
      downloadCv: "تنزيل السيرة الذاتية",
      projectDetails: "مزيد من التفاصيل",
      keyContributions: "أبرز المساهمات",
      keyChallenge: "التحدي الأبرز",
      googlePlay: "Google Play",
      appStore: "App Store"
    },
    hero: {
      greeting: "مرحبًا، أنا",
      name: "عبدالله محمد",
      role: "مطوّر تطبيقات الجوال",
      location: "القاهرة، مصر",
      tagline: "أبني تطبيقات جوال متعددة المنصات باستخدام Flutter، من الشاشة الأولى حتى النشر على Google Play و App Store.",
      avatarAlt: "عبدالله محمد مبتسمًا، يرتدي نظارة وسترة كحلية مخططة",
      ctaProjects: "استعرض أعمالي",
      ctaContact: "تواصل معي"
    },
    about: {
      title: "نبذة عني",
      paragraphs: [
        "مطوّر Flutter متفانٍ يركّز على تحقيق النتائج، ولديّ سجل حافل في تصميم تطبيقات معقدة وتنفيذها واختبارها وصيانتها في مجالات متنوعة. على مدى السنوات الخمس الماضية، صقلت مهاراتي في بناء واجهات مستخدم سلسة ووظائف متينة باستخدام إطار عمل Flutter. ويميّزني في مجال تطوير تطبيقات الجوال سريع التطور حرصي الدائم على مواكبة أحدث التقنيات، إلى جانب شغفي بابتكار تجارب مستخدم جذابة."
      ]
    },
    projects: {
      title: "المشاريع",
      intro: "اثنا عشر تطبيقًا عملت عليها باستخدام Flutter، مرتبة من الأحدث إلى الأقدم، مع روابط صفحاتها في المتاجر.",
      items: [
        {
          id: "alriyadh-app",
          title: "Alriyadh App",
          period: "09/2025 – 11/2025",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "نظام إدارة النفايات في الرياض منصة متكاملة صُمّمت لتحسين عمليات إدارة النفايات في مدينة الرياض، وتضم ميزات للتتبع اللحظي وإعادة عرض المسارات ورسومًا بيانية للخدمات.",
          contributions: [
            "الخرائط (العلامات ورسم المسارات بخطوط polyline)",
            "الرسوم البيانية"
          ],
          imageAlt: "أيقونة Alriyadh App"
        },
        {
          id: "waste-transportation-request",
          title: "Waste Transportation Request",
          period: "01/2025 – 03/2025",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "تطبيق لطلبات نقل النفايات يضم نوعين من المستخدمين: مسؤول أو مستشار يضيف الطلبات، وسائق يتلقى إشعارًا بكل طلب، فيقبله ويعرضه على الخريطة ويفتح الخريطة للتوجّه إليه، ثم يُتمّ الطلب بإرفاق صورة.",
          contributions: [
            "الإشعارات في جميع حالات التطبيق: في الواجهة، وفي الخلفية، وبعد إغلاقه تمامًا",
            "خرائط Google والتنقل داخل التطبيق",
            "بناء واجهة المستخدم",
            "ربط واجهات RESTful API",
            "نشر التطبيق"
          ],
          imageAlt: "أيقونة Waste Transportation Request"
        },
        {
          id: "taher",
          title: "Taher",
          period: "02/2024 – 05/2024",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "طُوّر تطبيق Taher مع E.VISION لإدارة شكاوى النفايات في المملكة العربية السعودية: يستطيع المسؤول تسجيل الدخول وإضافة شكوى ومتابعة حالتها.",
          contributions: [
            "وضع العمل دون اتصال: يستطيع المسؤول حفظ الشكوى على الجهاز ورفعها إلى الخادم فور عودة الاتصال",
            "بناء واجهة المستخدم",
            "ربط واجهات RESTful API",
            "نشر التطبيق"
          ],
          imageAlt: "أيقونة Taher"
        },
        {
          id: "home-experience",
          title: "Home Experience",
          period: "06/2023 – 09/2023",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "تطبيق سهل الاستخدام لبيع الأثاث، يركّز على تكامل سلس مع التجارة الإلكترونية وواجهة بديهية.",
          contributions: [
            "الروابط العميقة (Deep linking) باستخدام GoRouter",
            "بناء واجهة المستخدم",
            "ربط واجهات RESTful API",
            "التعامل مع الإشعارات",
            "نشر التطبيق"
          ],
          imageAlt: "أيقونة Home Experience"
        },
        {
          id: "fix-infinity",
          title: "Fix Infinity",
          period: "03/2023 – 06/2023",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "تطبيق يركّز على إصلاح الأجهزة الإلكترونية وبيع المنتجات.",
          contributions: [
            "بناء واجهة المستخدم",
            "ربط واجهات RESTful API",
            "التعامل مع الإشعارات",
            "نشر التطبيق"
          ],
          challenge: "استخدام Pusher لتشغيل المحادثة الفورية.",
          imageAlt: "أيقونة Fix Infinity"
        },
        {
          id: "alwsata-employees",
          title: "Alwsata Real Estate Employees",
          period: "05/2022 – حتى الآن",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "تطبيق يوفّر حسابات لموظفي Alwsata Real Estate لتسهيل عملهم على نظام Alwsata.",
          contributions: [
            "بناء جزء من واجهة المستخدم",
            "ربط واجهات RESTful API"
          ],
          imageAlt: "أيقونة Alwsata Real Estate Employees"
        },
        {
          id: "alwsata-real-estate",
          title: "Alwsata Real Estate Co",
          period: "05/2022 – حتى الآن",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "تطبيق يبسّط تعقيدات المعاملات العقارية بأدوات مالية سهلة الاستخدام، إذ يتيح للمستخدمين إجراء حسابات التمويل العقاري بسهولة واستكشاف خيارات التمويل والتعامل مع مستشارهم الخاص.",
          contributions: [
            "بناء جزء من واجهة المستخدم",
            "ربط واجهات RESTful API"
          ],
          imageAlt: "أيقونة Alwsata Real Estate Co"
        },
        {
          id: "al7feaz",
          title: "Al7feaz",
          period: "03/2022 – 05/2022",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "تطبيق جوال سهل الاستخدام صُمّم لإتمام معاملات المنتجات بسلاسة. يركّز على البساطة، فيتيح للمستخدمين بيع المنتجات بسهولة وإصدار الفواتير للعملاء وتبسيط عملية الدفع. كما يوفّر Al7feaz مسحًا سهلًا لرموز QR يرفع كفاءة المعاملات.",
          contributions: [
            "بناء واجهة المستخدم",
            "ربط واجهات RESTful API",
            "التعامل مع مسح رموز QR",
            "نشر التطبيق"
          ],
          imageAlt: "أيقونة Al7feaz"
        },
        {
          id: "doctorcrypto",
          title: "DoctorCrypto",
          period: "01/2022 – 03/2022",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "صُمّم هذا التطبيق لتقديم توصيات مخصّصة تناسب أهدافك في الاستثمار بالعملات المشفّرة. سواء كنت مستثمرًا متمرّسًا أو في بداية الطريق، يحلّل DoctorCrypto اتجاهات السوق وتفضيلاتك ليقدّم اقتراحات واضحة قابلة للتنفيذ. ابقَ على اطلاع، واتخذ قرارات مدروسة.",
          contributions: [
            "بناء واجهة المستخدم",
            "الربط مع Firebase",
            "إدارة الحسابات المجانية والمميّزة",
            "نشر التطبيق"
          ],
          imageAlt: "أيقونة DoctorCrypto"
        },
        {
          id: "chkchk",
          title: "ChkChk",
          period: "11/2021 – 12/2021",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "ChkChk تطبيق تجارة إلكترونية متعدد الاستخدامات صُمّم ليكون بسيطًا وعمليًا، إذ يتيح للمستخدمين تصفّح مجموعة متنوعة من المنتجات وشراءها بسهولة. وما يميّز ChkChk قدرته الفريدة على تسهيل طلبات إرسال الطرود إلى الآخرين. كما يضم التطبيق خريطة لحظية تزوّد المستخدمين بتحديثات مباشرة عن حالة طلباتهم وشحناتهم ومواقعها.",
          contributions: [
            "بناء واجهة المستخدم",
            "ربط واجهات RESTful API",
            "التعامل مع الإشعارات",
            "نشر التطبيق"
          ],
          challenge: "العمل مع خرائط Google والتعامل مع الموقع اللحظي.",
          imageAlt: "أيقونة ChkChk"
        },
        {
          id: "messayel",
          title: "Messayel",
          period: "10/2021 – 11/2021",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "Messayel تطبيق مخصّص للفرسان الطموحين ومحبي الخيل. تربط هذه المنصة الفريدة المستخدمين بمدرّبين موثوقين، وتوفّر مساحة مخصّصة لحجز دروس ركوب الخيل. ومن خلال متجره المدمج، يقدّم Messayel تشكيلة مختارة من مستلزمات الفروسية، من خوذات الفرسان إلى الأدوات المتخصّصة. إنه بوابتك إلى تجربة فروسية أصيلة، تجمع التدريب والمعدات وروح الفروسية في تطبيق واحد سهل الاستخدام.",
          contributions: [
            "بناء واجهة المستخدم",
            "ربط واجهات RESTful API",
            "التعامل مع الإشعارات",
            "نشر التطبيق"
          ],
          challenge: "دمج بوابة الدفع Tap لمعالجة المدفوعات.",
          imageAlt: "أيقونة Messayel"
        },
        {
          id: "bedayat",
          title: "Bedayat",
          period: "08/2021 – 09/2021",
          role: "مطوّر تطبيقات الجوال",
          tech: "Flutter",
          description: "Bedayat هو التطبيق الأمثل لأولياء الأمور الذين لديهم أطفال في رياض الأطفال. ابقَ على تواصل مع يوم طفلك لحظة بلحظة، من وصوله إلى بوابة الروضة حتى أنشطته اليومية مثل الوجبات. وبفضل الحسابات المخصّصة لكل طفل، يبقيك Bedayat على اطلاع ومشاركة دائمين، لتعتني بصغيرك بكل سهولة. إنه نافذتك على مغامرات طفلك اليومية، وأداة مريحة للاطمئنان على سلامته في كل خطوة.",
          contributions: [],
          imageAlt: "أيقونة Bedayat"
        }
      ]
    },
    skills: {
      title: "المهارات والخبرات",
      skillsTitle: "المهارات",
      items: [
        { name: "Flutter", description: "إتقان بناء تطبيقات جوال متعددة المنصات باستخدام إطار عمل Flutter." },
        { name: "Dart", description: "تمكّن قوي من لغة Dart المستخدمة في تطوير تطبيقات Flutter." },
        { name: "إدارة الحالة", description: "معرفة بأساليب إدارة الحالة المختلفة في Flutter (Provider وBLoC وGetX وRiverpod)." },
        { name: "تكامل واجهات API", description: "خبرة واسعة في ربط واجهات RESTful API والخدمات الخارجية بتطبيقات Flutter." },
        { name: "Firebase", description: "خبرة في استخدام خدمات Firebase للمصادقة وقواعد البيانات والدوال السحابية." },
        { name: "قواعد البيانات المحلية", description: "إتقان إنشاء قواعد البيانات المحلية وإدارتها باستخدام أدوات مثل SQLite أو Hive." },
        { name: "إدارة الإصدارات", description: "خبرة في أنظمة إدارة الإصدارات مثل Git لتعاون فعّال وإدارة منظّمة للشيفرة البرمجية." },
        { name: "CI/CD", description: "معرفة بمسارات CI/CD لأتمتة عمليات الاختبار والنشر." },
        { name: "الاختبار", description: "مهارة في كتابة اختبارات الوحدات واختبارات الواجهات (Widget tests) لتطبيقات Flutter." },
        { name: "التصميم المتجاوب", description: "القدرة على إنشاء تخطيطات متجاوبة تناسب مختلف أحجام الشاشات واتجاهاتها." },
        { name: "تحسين الأداء", description: "خبرة في تحسين أداء التطبيقات لتكون أسرع وأكثر استجابة." },
        { name: "تصحيح الأخطاء وتحليل الأداء", description: "إتقان تصحيح الأخطاء واستخدام أدوات تحليل الأداء لاكتشاف المشكلات وحلّها." }
      ]
    },
    experience: {
      title: "الخبرات",
      appsLabel: "التطبيقات المنجزة",
      items: [
        {
          id: "evision",
          company: "E.VISION for Information Technology",
          role: "مطوّر تطبيقات الجوال",
          period: "12/2023 – حتى الآن",
          location: "القاهرة",
          apps: ["Alriyadh App", "Waste Transportation Request", "Taher"]
        },
        {
          id: "alwsata",
          company: "Alwsata",
          role: "مطوّر تطبيقات الجوال",
          period: "08/2022 – حتى الآن",
          location: "المملكة العربية السعودية",
          apps: ["Alwsata Real Estate Co", "Alwsata Real Estate Employees"]
        },
        {
          id: "csskw",
          company: "Csskw",
          role: "مطوّر تطبيقات الجوال",
          period: "01/2022 – 07/2022",
          location: "الكويت",
          apps: ["Al7feaz", "Messayel", "ChkChk"]
        },
        {
          id: "rizme",
          company: "Rizme",
          role: "مطوّر تطبيقات الجوال",
          period: "05/2021 – 12/2021",
          location: "مصر",
          apps: ["Bedayat"]
        }
      ]
    },
    education: {
      title: "التعليم",
      degree: "علوم الحاسب",
      institution: "كلية الحاسبات والمعلومات",
      period: "09/2014 – 09/2018"
    },
    certificates: {
      title: "الشهادات",
      items: [
        { id: "clean-code", title: "Clean Code" },
        { id: "clean-architecture-flutter", title: "Clean Architecture in Flutter 3 (Arabic)" },
        { id: "flutter-bloc", title: "Flutter BLoC - From Zero to Hero Complete Course" },
        { id: "flutter-dart-2022", title: "The Complete 2022 Flutter & Dart Development Course [Arabic]" },
        { id: "dart-novice-expert", title: "Dart - from Novice to Expert Complete Course" },
        { id: "flutter-dart-guide-2023", title: "Flutter & Dart - The Complete Guide [2023 Edition]" }
      ]
    },
    languages: {
      title: "اللغات",
      items: ["العربية", "الإنجليزية"]
    },
    contact: {
      title: "تواصل معي",
      intro: "تبحث عن مطوّر Flutter لتطبيقك القادم؟ تواصل معي عبر أيٍّ من القنوات أدناه.",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "الهاتف",
      phoneDisplay: "+20 114 723 4230",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      stackoverflowLabel: "Stack Overflow"
    },
    footer: {
      text: "© 2026 عبدالله محمد. جميع الحقوق محفوظة."
    }
  }
};
