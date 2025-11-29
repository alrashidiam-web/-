
// ... existing imports
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const translationsEN = {
  // ... existing translations
  app: {
    title: "Strategic Advisor",
    gbt: "GPT",
    subtitle: "Your AI-powered strategic consultant for enterprise analysis and process optimization.",
    footer: "© 2024 Strategic Advisor GPT. Powered by Google Gemini. All rights reserved.",
    footerDesc: "Empowering businesses with AI-driven strategic insights, financial benchmarking, and automated operational workflows.",
    errorBoundary: {
      title: "An Unexpected Error Occurred",
      message: "Sorry, something went wrong while displaying this part of the application. Please try again.",
      reset: "Start Over",
    },
    errorModal: {
        title: "An Error Occurred",
        jsonError: "The AI output format was invalid. Please try adding more specific details to your 'Operational Processes Overview' to provide better context.",
        networkError: "Connection failed. Please check your internet connection and try again.",
        geminiError: "The AI service is currently experiencing high load. Please wait a moment and try again.",
        quotaExceeded: "System busy (Rate Limit). Please wait 60 seconds before trying again.",
        invalidKey: "Authentication failed. The API key is missing or invalid.",
        safetyBlock: "Content flagged by safety filters. Please revise your input to be more professional and remove any sensitive terms.",
        emptyResponse: "The AI returned an empty response. Please try expanding your input data.",
        bubble: {
            loadError: "Could not load your saved reports. Please check your connection and try again.",
            saveError: "Failed to save the report to your account. Please try again.",
            deleteError: "Could not delete the report. Please try again."
        },
        unknownError: "An unknown error occurred. Please try again later.",
    },
    startNewAnalysis: "New Analysis",
    pricing: "Pricing",
    about: "About Us",
    contact: "Contact",
    faq: "FAQ",
    blog: "Insights",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  admin: {
    menuLink: "Dashboard",
    title: "Admin Dashboard",
    tabs: {
        settings: "General Settings",
        blog: "Blog Management",
        users: "User Management",
        content: "Content (FAQ)"
    },
    users: {
        title: "Registered Users"
    },
    settings: {
        socialTitle: "Social Media Links",
        systemTitle: "System Configuration",
        maintenance: "Maintenance Mode"
    },
    save: "Save Changes",
    settingsSaved: "Settings saved successfully"
  },
  seo: {
    landing: {
        title: "AI Business Consultant | Strategy & SOPs",
        desc: "Transform your business with AI. Get professional strategic analysis, financial policies, and SOPs in seconds with Strategic Advisor GPT."
    },
    pricing: {
        title: "Plans & Pricing",
        desc: "Affordable strategic consulting for everyone. Start for free and upgrade for advanced exports and unlimited history."
    },
    about: {
        title: "About Us - Our Mission",
        desc: "We are democratizing top-tier management consulting using advanced AI to help businesses of all sizes succeed."
    },
    blog: {
        title: "Strategic Insights Blog",
        desc: "Read the latest articles on digital transformation, financial planning, and business strategy."
    },
    contact: {
        title: "Contact Us",
        desc: "Get in touch with our team for enterprise solutions, support, or general inquiries."
    },
    faq: {
        title: "Frequently Asked Questions",
        desc: "Find answers to common questions about our AI analysis, data security, and billing."
    },
    form: {
        title: "Start Your Analysis",
        desc: "Enter your business details to receive a comprehensive strategic report and operational manuals."
    },
    analysis: {
        title: "Your Strategic Report",
        desc: "View your personalized business analysis, financial benchmarks, and recommended strategic initiatives."
    }
  },
  // ... other sections
  footer: {
      product: "Product",
      company: "Company",
      legal: "Legal"
  },
  auth: {
      login: "Login",
      logout: "Logout",
      welcome: "Welcome",
      loginRedirect: "In a real application, you would be redirected to the Bubble login page.",
      logoutRedirect: "In a real application, you would be logged out from your Bubble session."
  },
  languageSwitcher: {
    en: "English",
    ar: "العربية",
  },
  landing: {
    hero: {
        title: "Transform Your Business Strategy with AI",
        subtitle: "Get Big-4 level consulting reports, comprehensive SWOT analysis, and tailored SOPs in minutes, not months.",
        cta: "Start Free Analysis",
        secondaryCta: "Learn More"
    },
    features: {
        title: "Why Choose Strategic Advisor?",
        speed: {
            title: "Instant Analysis",
            desc: "Turn complex business data into actionable insights in seconds."
        },
        ai: {
            title: "Advanced AI Model",
            desc: "Powered by Google Gemini 2.5 to provide deep, contextual understanding."
        },
        docs: {
            title: "Auto-Generated Manuals",
            desc: "Create Financial Policies and SOPs with a single click."
        },
        export: {
            title: "Professional Reports",
            desc: "Export findings to PDF or print directly for your board meetings."
        }
    },
    howItWorks: {
        title: "How It Works",
        step1: "Enter Data",
        step1Desc: "Input your organization details or choose a preset template.",
        step2: "AI Processing",
        step2Desc: "Our AI analyzes your inputs against global industry standards.",
        step3: "Get Results",
        step3Desc: "Receive a comprehensive report and generate operational manuals."
    }
  },
  blog: {
      badge: "Our Blog",
      title: "Strategic Insights & Trends",
      subtitle: "Expert articles on modern business management, digital transformation, and financial efficiency.",
      readMore: "Read Article",
      share: "Share this article",
      posts: [
          {
              id: "1",
              title: "The Role of AI in Modern Strategic Planning",
              excerpt: "Artificial Intelligence is no longer just a buzzword; it's a fundamental shift in how businesses plan for the future. Learn how predictive analytics can reshape your quarterly reviews.",
              date: "October 15, 2024",
              category: "Strategy",
              readTime: "5 min read",
              content: "<p>Strategic planning has traditionally been a retrospective exercise. Executives look at last quarter's numbers, adjust forecasts, and set new goals. AI changes this dynamic entirely by making planning <strong>predictive</strong> rather than reactive.</p><h3>The Shift from Data to Insights</h3><p>Traditional tools give you data tables. AI gives you narratives. By analyzing vast amounts of unstructured data—from customer emails to global market trends—AI agents can identify opportunities that human analysts might miss due to cognitive bias.</p><h3>Implementing AI in Your SOPs</h3><p>Start small. Automated financial reporting is a great first step. By using tools like Strategic Advisor GPT, you can standardize your reporting structure, ensuring that every department speaks the same financial language.</p>"
          },
          {
              id: "2",
              title: "5 Financial Policies Every Startup Needs",
              excerpt: "Chaos in finance kills startups faster than lack of product-market fit. Here are the five essential policies you need to implement before Series A.",
              date: "November 2, 2024",
              category: "Finance",
              readTime: "4 min read",
              content: "<p>Startups often view 'policies' as bureaucratic red tape. However, financial policies are actually freedom rails—they define the safe zone within which your team can move fast without breaking the bank.</p><h3>1. Delegation of Authority (DoA)</h3><p>Who can sign a check? Who can approve a hire? Without a clear DoA, founders become bottlenecks. Define clear limits: e.g., Department heads can spend up to $5k without approval.</p><h3>2. Procurement Policy</h3><p>Avoid vendor lock-in and fraud. Mandate three quotes for any purchase over a certain threshold. It sounds tedious, but it saves an average of 15% on OPEX.</p>"
          },
          {
              id: "3",
              title: "Digital Transformation: Beyond the Buzzwords",
              excerpt: "True digital transformation isn't just about buying new software; it's about changing how your organization thinks about value delivery.",
              date: "November 10, 2024",
              category: "Technology",
              readTime: "6 min read",
              content: "<p>Many companies confuse 'digitization' with 'digital transformation'. Digitization is turning paper into PDFs. Digital transformation is changing your business model because you have that data.</p><h3>The Cultural Aspect</h3><p>Technology is easy; people are hard. The biggest barrier to transformation is internal resistance. Your SOPs need to reflect the new way of working, not just describe how to click buttons in the new ERP.</p>"
          }
      ]
  },
  // ... other sections (about, contact, faq, legal, inputForm, analysisDisplay, etc. - keeping existing)
  about: {
      badge: "Our Philosophy",
      hero: {
          title: "Empowering Organizational Vision",
          subtitle: "We combine world-class consulting methodologies with advanced artificial intelligence to democratize strategic planning for everyone."
      },
      mission: {
          title: "Our Mission",
          desc: "Strategic Advisor GPT was founded to bridge the gap between expensive top-tier consulting and accessible business tools. We believe every organization, regardless of size, deserves high-quality strategic guidance.",
          points: {
              expertAI: { title: "Expert AI Models", desc: "Fine-tuned on thousands of business cases." },
              dataDriven: { title: "Data-Driven Insights", desc: "Benchmarked against real industry standards." },
              secure: { title: "Secure & Private", desc: "Your strategic data remains confidential." }
          }
      },
      story: {
          title: "Why We Exist",
          desc: "Traditional consulting is slow and expensive. We replaced the weeks of waiting with seconds of processing, allowing leaders to focus on execution rather than documentation."
      },
      stats: {
          reports: "Reports Generated",
          satisfaction: "Client Satisfaction"
      }
  },
  contact: {
      title: "Get in Touch",
      subtitle: "Have questions about enterprise plans or need support? We're here to help.",
      email: "Email Us",
      emailDesc: "For general inquiries and support.",
      office: "Headquarters",
      address: "King Fahd Road, Olaya District, Riyadh, Saudi Arabia",
      success: {
          title: "Message Sent!",
          msg: "Thank you for contacting us. We will get back to you within 24 hours.",
          reset: "Send another message"
      },
      form: {
          name: "Full Name",
          namePlaceholder: "John Doe",
          email: "Email Address",
          emailPlaceholder: "john@company.com",
          subject: "Subject",
          subjects: {
              general: "General Inquiry",
              support: "Technical Support",
              sales: "Sales & Enterprise"
          },
          message: "Message",
          messagePlaceholder: "How can we help you?",
          submit: "Send Message"
      }
  },
  faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about the product and billing.",
      moreQuestions: "Still have questions?",
      contactSupport: "Can't find the answer you're looking for? Please chat to our friendly team.",
      items: [
          { q: "Is the analysis free?", a: "We offer a 'Starter' plan which is free forever. It allows you to generate basic analyses. For advanced features like PDF export and detailed SOP generation, you can upgrade to Pro." },
          { q: "How accurate is the AI analysis?", a: "Our model uses the Gemini 2.5 Pro architecture, fine-tuned on business case studies. While it provides high-quality strategic direction, we always recommend reviewing the outputs with a human consultant for critical decisions." },
          { q: "Is my business data secure?", a: "Yes. We do not use your submitted business data to train our public models. Reports saved to your account are encrypted." },
          { q: "Can I export the reports?", a: "Yes, Pro users can export reports to PDF. You can also print reports directly from the browser in the free plan." },
          { q: "Do you offer enterprise API access?", a: "Yes, we offer an API for large organizations wanting to integrate our analysis engine into their own dashboards. Please contact sales." }
      ]
  },
  legal: {
      lastUpdated: "Last Updated",
      privacy: {
          title: "Privacy Policy",
          content: "<p><strong>1. Introduction</strong><br>Welcome to Strategic Advisor GPT. We respect your privacy and are committed to protecting your personal data.</p><p><strong>2. Data We Collect</strong><br>We collect information you provide directly to us, such as when you create an account, submit business data for analysis, or contact us for support.</p><p><strong>3. Use of Data</strong><br>We use your data to provide, maintain, and improve our services. Your specific business inputs are processed by our AI providers (Google) solely for the purpose of generating your report.</p><p><strong>4. Data Security</strong><br>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access.</p>"
      },
      terms: {
          title: "Terms of Service",
          content: "<p><strong>1. Acceptance of Terms</strong><br>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p><p><strong>2. Description of Service</strong><br>Strategic Advisor GPT provides AI-powered business analysis. The reports are for informational purposes only and do not constitute professional financial or legal advice.</p><p><strong>3. User Conduct</strong><br>You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.</p><p><strong>4. Limitation of Liability</strong><br>In no event shall Strategic Advisor GPT be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use of the service.</p>"
      }
  },
  inputForm: {
    title: "Enter Business Details",
    templates: {
        title: "Start with a Template (Optional)",
        clearSelection: "Start Fresh",
        ecommerce_startup_name: "E-commerce Startup",
        ecommerce_startup_description: "Pre-fills data for a typical online retail business.",
        manufacturing_company_name: "Manufacturing Company",
        manufacturing_company_description: "A template for businesses involved in production and assembly.",
        service_business_name: "Service-Based Business",
        service_business_description: "Designed for consultancies, agencies, or professional services firms."
    },
    orgName: {
        label: "Organization Name",
        help: "This is used to customize the report titles.",
        required: "Organization Name is required.",
    },
    legalForm: {
        label: "Legal Form",
        placeholder: "e.g., LLC, Joint Stock, Government Entity, Non-profit",
        help: "Defines the legal structure and liability of the organization.",
        required: "Legal Form is required.",
    },
    sector: {
        label: "Sector / Industry",
        help: "Specifying the sector helps the AI benchmark against industry standards.",
        required: "Sector / Industry is required.",
    },
    size: {
        label: "Organization Size (e.g., 50 employees)",
        help: "Size affects the relevance of recommendations (e.g., startup, mid-size corporation).",
        required: "Organization Size is required.",
    },
    companyLocation: {
        label: "Geographic Location (e.g., Riyadh, KSA)",
        help: "Specifies the operational area to tailor policies to local contexts.",
        required: "Geographic Location is required.",
    },
    accountingSystem: {
        label: "Current Accounting System",
        manualInput: "Manual Entry",
        fileUpload: "File Upload",
        help: "Describe your current system (e.g., QuickBooks, SAP, Excel spreadsheets) or upload a file with it.",
        required: "Current Accounting System is required.",
        fileRequired: "Please upload a file and ensure it is read successfully before proceeding.",
        fileEmpty: "The uploaded file is empty. Please select a file with data.",
        fileSizeError: "File size exceeds the 5MB limit.",
        fileReadError: "An error occurred while reading the file.",
        readingFile: "Reading...",
        chooseFile: "Choose a file...",
    },
    keyDepartments: {
        label: "Key Departments (comma-separated)",
        help: "Helps in assigning responsibilities and mapping internal processes.",
        required: "Key Departments are required.",
    },
    targetAudience: {
        label: "Target Audience (Optional)",
        placeholder: "e.g., C-level executives, investors, department managers",
        help: "Specify who will read this report to tailor the language and focus.",
    },
    operationalProcesses: {
        label: "Operational Processes Overview",
        help: "This is the most critical field. The more detailed your description, the better the AI's analysis.",
        required: "Operational Processes Overview is required.",
    },
    detailLevel: {
        label: "Report Detail Level",
        comprehensive: {
            title: "Comprehensive",
            description: "Generates a complete report with ready-to-implement documentation and templates."
        },
        detailed: {
            title: "Detailed",
            description: "Includes a deeper analysis and specific recommendations."
        },
        summary: {
            title: "Summary",
            description: "Provides high-level insights and key takeaways."
        }
    },
    advanced: {
      show: "Show Advanced Options",
      hide: "Hide Advanced Options",
      strategicTitle: "Strategic Analysis Inputs (Optional)",
      strategicHelp: "The AI will incorporate these points directly into its analysis to reflect your insights.",
      swot: {
        strengths: "Strengths",
        strengthsPlaceholder: "e.g., Strong brand...",
        weaknesses: "Weaknesses",
        weaknessesPlaceholder: "e.g., High debt...",
        opportunities: "Opportunities",
        opportunitiesPlaceholder: "e.g., New markets...",
        threats: "Threats",
        threatsPlaceholder: "e.g., New competitors...",
      },
      competitors: {
        title: "Competitor Information",
        help: "This will help in conducting a more accurate competitive analysis.",
        add: "Add Competitor",
        remove: "Remove competitor",
        name: "Competitor Name",
        namePlaceholder: "e.g., Alpha Corp",
        marketShare: "Market Share (Approx.)",
        marketSharePlaceholder: "e.g., 25%",
        strengths: "Strengths",
        strengthsPlaceholder: "e.g., Wide distribution network...",
        weaknesses: "Weaknesses",
        weaknessesPlaceholder: "e.g., Outdated technology...",
      },
      financialTitle: "Financial Structure Customization (Optional)",
      chartOfAccounts: {
        label: "Custom Chart of Accounts Categories",
        placeholder: "e.g., Digital Marketing Expenses, Subscription Revenue, R&D Costs",
        help: "Enter categories you wish to include, separated by a comma.",
      },
      costCenters: {
        label: "Custom Cost Centers",
        placeholder: "e.g., Project Alpha, Frontend Dev Team, Q1 Ad Campaign",
        help: "Enter cost centers you wish to include, separated by a comma.",
      }
    },
    buttons: {
      history: "Saved Reports",
      historyDisabledTooltip: "Please log in to view saved reports.",
      analyze: "Generate Analysis",
    }
  },
  analysisDisplay: {
    startNew: "Start New Analysis",
    copyButton: {
      copy: "Copy to Clipboard",
      copied: "Copied!",
    },
    printButton: "Print Report",
    pdfButton: "Export PDF",
    pdfGenerating: "Generating PDF...",
    benchmarks: {
      title: "Financial & Operational Benchmarks",
      subtitle: "Compare estimated company performance against industry averages.",
      generateButton: "Generate Industry Benchmarks",
      error: "Failed to generate benchmarks. Please try again.",
      companyLabel: "Estimated Company Value",
      industryLabel: "Industry Average"
    },
    manuals: {
        title: "Next Steps: Generate Working Guides",
        subtitle: "Based on the analysis, you can now generate detailed policies and procedures manuals for your organization.",
        error: "Failed to generate the manual. Please try again later.",
        financial_policies: {
            title: "Financial Policies Manual",
            description: "Establishes financial governance and control principles."
        },
        financial_sops: {
            title: "Financial Procedures (SOPs)",
            description: "Standardizes key accounting and financial processes."
        },
        admin_sops: {
            title: "Administrative Procedures (SOPs)",
            description: "Organizes daily operational and administrative workflows."
        }
    },
    feedback: {
        title: "Rate this Analysis",
        ratingLabel: "How useful was this report?",
        placeholder: "Any additional comments or suggestions? (Optional)",
        submit: "Submit Feedback",
        success: "Thank you for your feedback!"
    }
  },
  manualDisplayModal: {
    close: "Close",
  },
  loadingSpinner: {
    messages: [
      "Analyzing business data...",
      "Identifying strengths and weaknesses...",
      "Benchmarking against ideal practices...",
      "Formulating strategic recommendations...",
      "Generating comprehensive reports...",
      "Assembling document templates...",
    ]
  },
  tour: {
    steps: [
      {
        title: "Welcome to the Strategic Advisor GPT!",
        content: "Let's take a quick tour to see how you can get a comprehensive strategic analysis for your company."
      },
      {
        title: "Start with Your Company Details",
        content: "Enter your organization's name here. This will help personalize the report for your company."
      },
      {
        title: "Specify Your Sector",
        content: "Mention the industry or sector your company operates in for an accurate comparative analysis."
      },
      {
        title: "Describe Your Operations",
        content: "This field is the most important. The more detailed your description of your operational processes, the better the AI's analysis."
      },
      {
        title: "Get Your Analysis",
        content: "After filling in all the fields, click here. The AI will analyze your data and generate a comprehensive report in seconds."
      },
      {
        title: "You're All Set!",
        content: "Start by entering your data to get strategic insights that will help you grow your business. Good luck!"
      }
    ],
    skip: "Skip",
    prev: "Prev",
    next: "Next",
    finish: "Finish"
  },
  savedReports: {
    title: "Saved Reports",
    loading: "Loading your reports...",
    noReports: "No saved reports yet.",
    noReportsHint: "Create a new analysis and it will be saved to your account.",
    viewTooltip: "View Report",
    deleteTooltip: "Delete Report",
  },
  pricing: {
    title: "Choose the Perfect Plan",
    subtitle: "Scale your business with professional strategic insights.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save",
    currentPlan: "Current Plan",
    plans: {
      free: {
        name: "Starter",
        desc: "Essential tools for small businesses.",
        price: "$0",
        features: [
          "Basic Strategic Analysis",
          "Summary Reports",
          "1 Saved Report History",
          "Community Support"
        ],
        cta: "Start Free"
      },
      pro: {
        name: "Professional",
        desc: "Advanced insights for growing companies.",
        price: "$49",
        features: [
          "Comprehensive Big-4 Analysis",
          "Unlimited Saved Reports",
          "Financial Policies Generation",
          "SOPs Generation",
          "PDF Export (White Label)",
          "Priority AI Processing"
        ],
        cta: "Upgrade to Pro"
      },
      enterprise: {
        name: "Enterprise",
        desc: "Custom solutions for large organizations.",
        price: "Custom",
        features: [
          "Dedicated Account Manager",
          "Custom AI Model Fine-tuning",
          "API Access",
          "On-premise Deployment Option",
          "SLA Support"
        ],
        cta: "Contact Sales"
      }
    }
  }
};

const translationsAR = {
  // ... existing translations
  app: {
    title: "المستشار الاستراتيجي",
    gbt: "GPT",
    subtitle: "مستشارك الاستراتيجي المدعوم بالذكاء الاصطناعي لتحليل المؤسسات وتحسين العمليات.",
    footer: "© 2024 المستشار الاستراتيجي GPT. مدعوم بواسطة Google Gemini. جميع الحقوق محفوظة.",
    footerDesc: "تمكين الشركات برؤى استراتيجية مدعومة بالذكاء الاصطناعي، ومقارنات معيارية، وسير عمل تشغيلي مؤتمت.",
    errorBoundary: {
      title: "حدث خطأ غير متوقع",
      message: "عذرًا، حدث خطأ ما أثناء عرض هذا الجزء من التطبيق. يرجى المحاولة مرة أخرى.",
      reset: "ابدأ من جديد",
    },
    errorModal: {
        title: "حدث خطأ",
        jsonError: "تنسيق مخرجات الذكاء الاصطناعي غير صالح. يرجى محاولة إضافة تفاصيل أكثر دقة في 'نظرة عامة على العمليات' لتوفير سياق أفضل.",
        networkError: "فشل الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
        geminiError: "خدمة الذكاء الاصطناعي تواجه ضغطًا عاليًا حاليًا. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.",
        quotaExceeded: "النظام مشغول (تجاوز الحد). يرجى الانتظار لمدة 60 ثانية قبل المحاولة مرة أخرى.",
        invalidKey: "فشل المصادقة. مفتاح API مفقود أو غير صالح.",
        safetyBlock: "تم حظر المحتوى بواسطة مرشحات الأمان. يرجى تعديل المدخلات لتكون أكثر احترافية وإزالة أي مصطلحات حساسة.",
        emptyResponse: "أعاد الذكاء الاصطناعي استجابة فارغة. يرجى محاولة توسيع البيانات المدخلة.",
        bubble: {
            loadError: "تعذر تحميل تقاريرك المحفوظة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
            saveError: "فشل حفظ التقرير في حسابك. يرجى المحاولة مرة أخرى.",
            deleteError: "تعذر حذف التقرير. يرجى المحاولة مرة أخرى."
        },
        unknownError: "حدث خطأ غير معروف. يرجى المحاولة مرة أخرى لاحقًا.",
    },
    startNewAnalysis: "تحليل جديد",
    pricing: "الأسعار",
    about: "من نحن",
    contact: "اتصل بنا",
    faq: "الأسئلة الشائعة",
    blog: "المدونة",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
  },
  admin: {
    menuLink: "لوحة التحكم",
    title: "لوحة تحكم المدير",
    tabs: {
        settings: "الإعدادات العامة",
        blog: "إدارة المدونة",
        users: "إدارة المستخدمين",
        content: "المحتوى (الأسئلة الشائعة)"
    },
    users: {
        title: "المستخدمون المسجلون"
    },
    settings: {
        socialTitle: "روابط التواصل الاجتماعي",
        systemTitle: "تكوين النظام",
        maintenance: "وضع الصيانة"
    },
    save: "حفظ التغييرات",
    settingsSaved: "تم حفظ الإعدادات بنجاح"
  },
  seo: {
    landing: {
        title: "مستشار أعمال بالذكاء الاصطناعي | استراتيجيات وأدلة تشغيل",
        desc: "طوّر أعمالك بالذكاء الاصطناعي. احصل على تحليل استراتيجي احترافي، سياسات مالية، وأدلة تشغيل (SOPs) في ثوانٍ مع المستشار الاستراتيجي."
    },
    pricing: {
        title: "الخطط والأسعار",
        desc: "استشارات استراتيجية بأسعار معقولة للجميع. ابدأ مجانًا وقم بالترقية للحصول على تصدير متقدم وسجل غير محدود."
    },
    about: {
        title: "من نحن - مهمتنا",
        desc: "نحن نعمل على إتاحة الاستشارات الإدارية رفيعة المستوى باستخدام الذكاء الاصطناعي المتقدم لمساعدة الشركات من جميع الأحجام على النجاح."
    },
    blog: {
        title: "مدونة الرؤى الاستراتيجية",
        desc: "اقرأ أحدث المقالات حول التحول الرقمي، التخطيط المالي، واستراتيجيات الأعمال الحديثة."
    },
    contact: {
        title: "تواصل معنا",
        desc: "تواصل مع فريقنا للحصول على حلول المؤسسات، الدعم الفني، أو الاستفسارات العامة."
    },
    faq: {
        title: "الأسئلة الشائعة",
        desc: "اعثر على إجابات للأسئلة الشائعة حول تحليل الذكاء الاصطناعي، أمن البيانات، والفوترة."
    },
    form: {
        title: "ابدأ تحليلك",
        desc: "أدخل تفاصيل عملك للحصول على تقرير استراتيجي شامل وأدلة تشغيلية مفصلة."
    },
    analysis: {
        title: "تقريرك الاستراتيجي",
        desc: "استعرض تحليل عملك المخصص، المعايير المالية، والمبادرات الاستراتيجية الموصى بها."
    }
  },
  // ... other sections
  footer: {
      product: "المنتج",
      company: "الشركة",
      legal: "قانوني"
  },
  auth: {
      login: "دخول",
      logout: "خروج",
      welcome: "أهلاً بك",
      loginRedirect: "في تطبيق حقيقي، سيتم توجيهك إلى صفحة تسجيل الدخول في Bubble.",
      logoutRedirect: "في تطبيق حقيقي، سيتم تسجيل خروجك من جلسة Bubble الخاصة بك."
  },
  languageSwitcher: {
    en: "English",
    ar: "العربية",
  },
  landing: {
    hero: {
        title: "حوّل استراتيجية عملك باستخدام الذكاء الاصطناعي",
        subtitle: "احصل على تقارير استشارية بمستوى الشركات العالمية، وتحليل SWOT شامل، وأدلة إجراءات مخصصة في دقائق، وليس شهور.",
        cta: "ابدأ التحليل مجاناً",
        secondaryCta: "اعرف المزيد"
    },
    features: {
        title: "لماذا تختار المستشار الاستراتيجي؟",
        speed: {
            title: "تحليل فوري",
            desc: "حول بيانات العمل المعقدة إلى رؤى قابلة للتنفيذ في ثوانٍ."
        },
        ai: {
            title: "نموذج ذكاء اصطناعي متطور",
            desc: "مدعوم بـ Google Gemini 2.5 لتوفير فهم عميق وسياقي."
        },
        docs: {
            title: "أدلة مولدة تلقائياً",
            desc: "أنشئ السياسات المالية وإجراءات التشغيل القياسية (SOPs) بنقرة واحدة."
        },
        export: {
            title: "تقارير احترافية",
            desc: "قم بتصدير النتائج إلى PDF أو طباعتها مباشرة لاجتماعات مجلس الإدارة."
        }
    },
    howItWorks: {
        title: "كيف يعمل؟",
        step1: "أدخل البيانات",
        step1Desc: "أدخل تفاصيل منظمتك أو اختر قالبًا جاهزًا.",
        step2: "المعالجة الذكية",
        step2Desc: "يقوم الذكاء الاصطناعي بتحليل مدخلاتك مقارنة بالمعايير العالمية.",
        step3: "احصل على النتائج",
        step3Desc: "استلم تقريرًا شاملاً وقم بتوليد أدلة التشغيل."
    }
  },
  blog: {
      badge: "المدونة",
      title: "أحدث الرؤى والاتجاهات",
      subtitle: "مقالات متخصصة في الإدارة الحديثة، التحول الرقمي، والكفاءة المالية.",
      readMore: "اقرأ المقال",
      share: "شارك المقال",
      posts: [
          {
              id: "1",
              title: "دور الذكاء الاصطناعي في التخطيط الاستراتيجي الحديث",
              excerpt: "لم يعد الذكاء الاصطناعي مجرد كلمة رنانة؛ بل هو تحول جذري في كيفية تخطيط الشركات للمستقبل. تعرف على كيفية إعادة تشكيل التحليلات التنبؤية لمراجعاتك الربع سنوية.",
              date: "١٥ أكتوبر ٢٠٢٤",
              category: "استراتيجية",
              readTime: "٥ د قراءة",
              content: "<p>لطالما كان التخطيط الاستراتيجي تمرينًا بأثر رجعي. ينظر المديرون التنفيذيون إلى أرقام الربع الماضي، ويعدلون التوقعات، ويضعون أهدافًا جديدة. يغير الذكاء الاصطناعي هذه الديناميكية تمامًا من خلال جعل التخطيط <strong>تنبئيًا</strong> بدلاً من تفاعلي.</p><h3>التحول من البيانات إلى الرؤى</h3><p>تعطيك الأدوات التقليدية جداول بيانات. يعطيك الذكاء الاصطناعي قصصًا. من خلال تحليل كميات هائلة من البيانات غير المهيكلة - من رسائل البريد الإلكتروني للعملاء إلى اتجاهات السوق العالمية - يمكن لوكلاء الذكاء الاصطناعي تحديد الفرص التي قد يفوتها المحللون البشريون بسبب التحيز المعرفي.</p><h3>تطبيق الذكاء الاصطناعي في إجراءات التشغيل القياسية (SOPs)</h3><p>ابدأ صغيرًا. إعداد التقارير المالية الآلي هو خطوة أولى رائعة. باستخدام أدوات مثل المستشار الاستراتيجي، يمكنك توحيد هيكل التقارير الخاص بك، مما يضمن أن كل قسم يتحدث نفس اللغة المالية.</p>"
          },
          {
              id: "2",
              title: "٥ سياسات مالية تحتاجها كل شركة ناشئة",
              excerpt: "الفوضى في المالية تقتل الشركات الناشئة أسرع من نقص ملاءمة المنتج للسوق. إليك السياسات الخمس الأساسية التي تحتاج إلى تنفيذها قبل الجولة الاستثمارية (أ).",
              date: "٢ نوفمبر ٢٠٢٤",
              category: "مالية",
              readTime: "٤ د قراءة",
              content: "<p>غالبًا ما تنظر الشركات الناشئة إلى 'السياسات' على أنها روتين بيروقراطي. ومع ذلك، فإن السياسات المالية هي في الواقع قضبان حرية - فهي تحدد المنطقة الآمنة التي يمكن لفريقك التحرك فيها بسرعة دون كسر الميزانية.</p><h3>١. سياسة تفويض الصلاحيات (DoA)</h3><p>من يمكنه توقيع شيك؟ من يمكنه الموافقة على تعيين؟ بدون تفويض واضح للصلاحيات، يصبح المؤسسون عنق زجاجة. حدد حدودًا واضحة: مثال، يمكن لرؤساء الأقسام إنفاق ما يصل إلى ٥٠٠٠ ريال دون موافقة.</p><h3>٢. سياسة المشتريات</h3><p>تجنب الاحتيال والاعتماد الكلي على مورد واحد. اطلب ثلاثة عروض أسعار لأي عملية شراء تتجاوز حدًا معينًا. يبدو الأمر مملًا، لكنه يوفر في المتوسط ١٥٪ من المصاريف التشغيلية.</p>"
          },
          {
              id: "3",
              title: "التحول الرقمي: ما وراء الكلمات الرنانة",
              excerpt: "التحول الرقمي الحقيقي لا يقتصر فقط على شراء برامج جديدة؛ بل يتعلق بتغيير كيفية تفكير مؤسستك في تقديم القيمة.",
              date: "١٠ نوفمبر ٢٠٢٤",
              category: "تكنولوجيا",
              readTime: "٦ د قراءة",
              content: "<p>تخلط العديد من الشركات بين 'الرقمنة' و 'التحول الرقمي'. الرقمنة هي تحويل الورق إلى ملفات PDF. التحول الرقمي هو تغيير نموذج عملك لأن لديك تلك البيانات.</p><h3>الجانب الثقافي</h3><p>التكنولوجيا سهلة؛ الناس صعبون. أكبر عائق أمام التحول هو المقاومة الداخلية. يجب أن تعكس إجراءات التشغيل القياسية الخاصة بك طريقة العمل الجديدة، وليس فقط وصف كيفية النقر فوق الأزرار في نظام تخطيط موارد المؤسسات الجديد.</p>"
          }
      ]
  },
  // ... other sections (about, contact, faq, legal, inputForm, analysisDisplay, etc. - keeping existing)
  about: {
      badge: "فلسفتنا",
      hero: {
          title: "تمكين الرؤية المؤسسية",
          subtitle: "نجمع بين منهجيات الاستشارات العالمية والذكاء الاصطناعي المتقدم لتمكين التخطيط الاستراتيجي للجميع."
      },
      mission: {
          title: "مهمتنا",
          desc: "تأسس المستشار الاستراتيجي GPT لسد الفجوة بين الاستشارات باهظة الثمن وأدوات الأعمال المتاحة. نحن نؤمن بأن كل منظمة، بغض النظر عن حجمها، تستحق توجيهًا استراتيجيًا عالي الجودة.",
          points: {
              expertAI: { title: "نماذج خبيرة", desc: "مدربة على آلاف الحالات التجارية." },
              dataDriven: { title: "رؤى مدعومة بالبيانات", desc: "مقارنة مع معايير الصناعة الحقيقية." },
              secure: { title: "آمن وخاص", desc: "تظل بياناتك الاستراتيجية سرية." }
          }
      },
      story: {
          title: "لماذا نحن هنا",
          desc: "الاستشارات التقليدية بطيئة ومكلفة. لقد استبدلنا أسابيع الانتظار بثوانٍ من المعالجة، مما يسمح للقادة بالتركيز على التنفيذ بدلاً من التوثيق."
      },
      stats: {
          reports: "تقرير تم إنشاؤه",
          satisfaction: "رضا العملاء"
      }
  },
  contact: {
      title: "تواصل معنا",
      subtitle: "هل لديك أسئلة حول باقات المؤسسات أو تحتاج إلى دعم؟ نحن هنا للمساعدة.",
      email: "راسلنا",
      emailDesc: "للاستفسارات العامة والدعم الفني.",
      office: "المقر الرئيسي",
      address: "طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية",
      success: {
          title: "تم الإرسال!",
          msg: "شكراً لتواصلك معنا. سنقوم بالرد عليك خلال 24 ساعة.",
          reset: "إرسال رسالة أخرى"
      },
      form: {
          name: "الاسم الكامل",
          namePlaceholder: "محمد أحمد",
          email: "البريد الإلكتروني",
          emailPlaceholder: "name@company.com",
          subject: "الموضوع",
          subjects: {
              general: "استفسار عام",
              support: "دعم فني",
              sales: "المبيعات والشركات"
          },
          message: "الرسالة",
          messagePlaceholder: "كيف يمكننا مساعدتك؟",
          submit: "إرسال الرسالة"
      }
  },
  faq: {
      title: "الأسئلة الشائعة",
      subtitle: "كل ما تحتاج معرفته حول المنتج والاشتراكات.",
      moreQuestions: "لا تزال لديك أسئلة؟",
      contactSupport: "لم تجد الإجابة التي تبحث عنها؟ تحدث إلى فريقنا الودود.",
      items: [
          { q: "هل التحليل مجاني؟", a: "نقدم باقة 'بداية' مجانية للأبد تتيح لك إنشاء تحليلات أساسية. للحصول على ميزات متقدمة مثل تصدير PDF وتوليد الأدلة التفصيلية، يمكنك الترقية إلى الباقة الاحترافية." },
          { q: "ما مدى دقة تحليل الذكاء الاصطناعي؟", a: "يستخدم نموذجنا بنية Gemini 2.5 Pro، التي تم ضبطها بدقة على دراسات الحالات التجارية. بينما يوفر توجيهًا استراتيجيًا عالي الجودة، نوصي دائمًا بمراجعة المخرجات مع مستشار بشري للقرارات الحاسمة." },
          { q: "هل بيانات عملي آمنة؟", a: "نعم. نحن لا نستخدم بيانات العمل التي ترسلها لتدريب نماذجنا العامة. التقارير المحفوظة في حسابك مشفرة." },
          { q: "هل يمكنني تصدير التقارير؟", a: "نعم، يمكن لمستخدمي Pro تصدير التقارير إلى PDF. يمكنك أيضًا طباعة التقارير مباشرة من المتصفح في الباقة المجانية." },
          { q: "هل تقدمون وصول API للشركات؟", a: "نعم، نقدم API للمنظمات الكبيرة التي ترغب في دمج محرك التحليل الخاص بنا في لوحات المعلومات الخاصة بها. يرجى التواصل مع المبيعات." }
      ]
  },
  legal: {
      lastUpdated: "آخر تحديث",
      privacy: {
          title: "سياسة الخصوصية",
          content: "<p><strong>1. مقدمة</strong><br>مرحبًا بك في المستشار الاستراتيجي GPT. نحن نحترم خصوصيتك وملتزمون بحماية بياناتك الشخصية.</p><p><strong>2. البيانات التي نجمعها</strong><br>نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب، أو إرسال بيانات العمل للتحليل، أو الاتصال بنا للدعم.</p><p><strong>3. استخدام البيانات</strong><br>نستخدم بياناتك لتقديم خدماتنا وصيانتها وتحسينها. تتم معالجة مدخلات عملك المحددة بواسطة مزودي الذكاء الاصطناعي لدينا (Google) فقط لغرض إنشاء تقريرك.</p><p><strong>4. أمن البيانات</strong><br>ننفذ تدابير فنية وتنظيمية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرح به.</p>"
      },
      terms: {
          title: "شروط الخدمة",
          content: "<p><strong>1. قبول الشروط</strong><br>من خلال الوصول إلى هذه الخدمة واستخدامها، فإنك توافق وتقبل الالتزام بشروط وأحكام هذه الاتفاقية.</p><p><strong>2. وصف الخدمة</strong><br>يوفر المستشار الاستراتيجي GPT تحليل أعمال مدعوم بالذكاء الاصطناعي. التقارير للأغراض الإعلامية فقط ولا تشكل مشورة مالية أو قانونية مهنية.</p><p><strong>3. سلوك المستخدم</strong><br>توافق على عدم استخدام الخدمة لأي غرض غير قانوني أو بأي طريقة تعطل الخدمة أو تضر بها.</p><p><strong>4. حدود المسؤولية</strong><br>لا يتحمل المستشار الاستراتيجي GPT بأي حال من الأحوال المسؤولية عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية تنشأ عن استخدام الخدمة.</p>"
      }
  },
  inputForm: {
    title: "أدخل تفاصيل العمل",
    templates: {
        title: "ابدأ باستخدام قالب (اختياري)",
        clearSelection: "البدء من جديد",
        ecommerce_startup_name: "شركة تجارة إلكترونية ناشئة",
        ecommerce_startup_description: "يملأ البيانات لشركة تجزئة نموذجية عبر الإنترنت.",
        manufacturing_company_name: "شركة صناعية",
        manufacturing_company_description: "قالب للشركات العاملة في الإنتاج والتجميع.",
        service_business_name: "شركة خدمات",
        service_business_description: "مصمم للشركات الاستشارية أو الوكالات أو شركات الخدمات المهنية."
    },
    orgName: {
        label: "اسم المنظمة",
        help: "يستخدم هذا لتخصيص عناوين التقرير.",
        required: "اسم المنظمة مطلوب.",
    },
    legalForm: {
        label: "الشكل القانوني",
        placeholder: "مثال: ذات مسؤولية محدودة، مساهمة، حكومية، غير ربحية",
        help: "يحدد الهيكل القانوني للمنظمة ومسؤولياتها.",
        required: "الشكل القانوني مطلوب.",
    },
    sector: {
        label: "القطاع / الصناعة",
        help: "يساعد تحديد القطاع الذكاء الاصطناعي على المقارنة مع معايير الصناعة.",
        required: "القطاع / الصناعة مطلوب.",
    },
    size: {
        label: "حجم المنظمة (مثال: 50 موظفًا)",
        help: "يؤثر الحجم على مدى ملاءمة التوصيات (مثال: شركة ناشئة، شركة متوسطة الحجم).",
        required: "حجم المنظمة مطلوب.",
    },
    companyLocation: {
        label: "المنطقة الجغرافية (مثال: الرياض، السعودية)",
        help: "تحدد منطقة العمليات لتكييف السياسات مع السياقات المحلية.",
        required: "المنطقة الجغرافية مطلوبة.",
    },
    accountingSystem: {
        label: "نظام المحاسبة الحالي",
        manualInput: "إدخال يدوي",
        fileUpload: "رفع ملف",
        help: "صف نظامك الحالي (مثل QuickBooks، SAP، جداول بيانات Excel) أو ارفع ملفًا به.",
        required: "نظام المحاسبة الحالي مطلوب.",
        fileRequired: "يرجى تحميل ملف والتأكد من قراءته بنجاح قبل المتابعة.",
        fileEmpty: "الملف الذي تم تحميله فارغ. يرجى اختيار ملف يحتوي على بيانات.",
        fileSizeError: "حجم الملف يتجاوز الحد المسموح به (5 ميجابايت).",
        fileReadError: "حدث خطأ أثناء قراءة الملف.",
        readingFile: "جاري القراءة...",
        chooseFile: "اختر ملفًا...",
    },
    keyDepartments: {
        label: "الأقسام الرئيسية (مفصولة بفاصلة)",
        help: "يساعد في تحديد المسؤوليات ورسم خرائط العمليات الداخلية.",
        required: "الأقسام الرئيسية مطلوبة.",
    },
    targetAudience: {
        label: "الجمهور المستهدف (اختياري)",
        placeholder: "مثال: مديرون تنفيذيون، مستثمرون، مديرو أقسام",
        help: "حدد من سيقرأ هذا التقرير لتخصيص اللغة والتركيز.",
    },
    operationalProcesses: {
        label: "نظرة عامة على العمليات التشغيلية",
        help: "هذا هو الحقل الأكثر أهمية. كلما كان الوصف أكثر تفصيلاً، كان تحليل الذكاء الاصطناعي أفضل.",
        required: "نظرة عامة على العمليات التشغيلية مطلوبة.",
    },
    detailLevel: {
        label: "مستوى تفاصيل التقرير",
        comprehensive: {
            title: "شامل",
            description: "ينشئ تقريباً كاملاً مع وثائق وقوالب جاهزة للتنفيذ."
        },
        detailed: {
            title: "مفصل",
            description: "يتضمن تحليلاً أعمق وتوصيات محددة."
        },
        summary: {
            title: "ملخص",
            description: "يقدم رؤى عالية المستوى ونقاط رئيسية."
        }
    },
    advanced: {
      show: "إظهار الخيارات المتقدمة",
      hide: "إخفاء الخيارات المتقدمة",
      strategicTitle: "مدخلات التحليل الاستراتيجي (اختياري)",
      strategicHelp: "سيقوم الذكاء الاصطناعي بدمج هذه النقاط مباشرة في تحليله ليعكس رؤيتك.",
      swot: {
        strengths: "نقاط القوة",
        strengthsPlaceholder: "مثال: علامة تجارية قوية...",
        weaknesses: "نقاط الضعف",
        weaknessesPlaceholder: "مثال: ديون عالية...",
        opportunities: "الفرص",
        opportunitiesPlaceholder: "مثال: أسواق جديدة...",
        threats: "التهديدات",
        threatsPlaceholder: "مثال: منافسون جدد...",
      },
      competitors: {
        title: "معلومات عن المنافسين",
        help: "سيساعد هذا في إجراء تحليل تنافسي أكثر دقة.",
        add: "إضافة منافس",
        remove: "إزالة منافس",
        name: "اسم المنافس",
        namePlaceholder: "مثال: شركة ألفا",
        marketShare: "الحصة السوقية (تقريبي)",
        marketSharePlaceholder: "مثال: 25%",
        strengths: "نقاط القوة",
        strengthsPlaceholder: "مثال: شبكة توزيع واسعة...",
        weaknesses: "نقاط الضعف",
        weaknessesPlaceholder: "مثال: تكنولوجيا قديمة...",
      },
      financialTitle: "تخصيص الهيكل المالي (اختياري)",
      chartOfAccounts: {
        label: "فئات دليل الحسابات المخصصة",
        placeholder: "مثال: مصاريف تسويق رقمي, عائدات الاشتراكات, تكاليف البحث والتطوير",
        help: "أدخل الفئات التي ترغب في تضمينها، مفصولة بفاصلة.",
      },
      costCenters: {
        label: "مراكز التكلفة المخصصة",
        placeholder: "مثال: مشروع ألفا, فريق تطوير الواجهة الأمامية, حملة إعلانية للربع الأول",
        help: "أدخل مراكز التكلفة التي ترغب في تضمينها، مفصولة بفاصلة.",
      }
    },
    buttons: {
      history: "التقارير المحفوظة",
      historyDisabledTooltip: "يرجى تسجيل الدخول لعرض التقارير المحفوظة.",
      analyze: "إنشاء التحليل",
    }
  },
  analysisDisplay: {
    startNew: "بدء تحليل جديد",
    copyButton: {
        copy: "نسخ إلى الحافظة",
        copied: "تم النسخ!",
    },
    printButton: "طباعة التقرير",
    pdfButton: "تصدير PDF",
    pdfGenerating: "جاري التصدير...",
    benchmarks: {
      title: "المعايير المالية والتشغيلية",
      subtitle: "مقارنة أداء الشركة التقديري مع متوسطات الصناعة.",
      generateButton: "توليد معايير الصناعة",
      error: "فشل في توليد المعايير. يرجى المحاولة مرة أخرى.",
      companyLabel: "قيمة الشركة التقديرية",
      industryLabel: "متوسط الصناعة"
    },
    manuals: {
        title: "الخطوات التالية: إنشاء أدلة العمل",
        subtitle: "بناءً على التحليل، يمكنك الآن إنشاء أدلة سياسات وإجراءات مفصلة لمنظمتك.",
        error: "فشل إنشاء الدليل. يرجى المحاولة مرة أخرى لاحقًا.",
        financial_policies: {
            title: "دليل السياسات المالية",
            description: "يؤسس لمبادئ الحوكمة والرقابة المالية السليمة."
        },
        financial_sops: {
            title: "دليل الإجراءات المالية (SOPs)",
            description: "يوحد العمليات المحاسبية والمالية الرئيسية."
        },
        admin_sops: {
            title: "دليل الإجراءات الإدارية (SOPs)",
            description: "ينظم سير العمل التشغيلي والإداري اليومي."
        }
    },
    feedback: {
        title: "قيّم هذا التحليل",
        ratingLabel: "ما مدى فائدة هذا التقرير؟",
        placeholder: "أي تعليقات أو اقتراحات إضافية؟ (اختياري)",
        submit: "إرسال التقييم",
        success: "شكراً لك على تقييمك!"
    }
  },
  manualDisplayModal: {
    close: "إغلاق",
  },
  loadingSpinner: {
    messages: [
      "جاري تحليل بيانات العمل...",
      "جاري تحديد نقاط القوة والضعف...",
      "جاري المقارنة مع الممارسات المثالية...",
      "جاري صياغة التوصيات الاستراتيجية...",
      "جاري إنشاء التقارير الشاملة...",
      "جاري تجميع قوالب الوثائق...",
    ]
  },
  tour: {
    steps: [
      {
        title: "مرحبًا بك في المستشار الاستراتيجي GPT!",
        content: "دعنا نأخذك في جولة سريعة لتتعرف على كيفية الحصول على تحليل استراتيجي شامل لشركتك."
      },
      {
        title: "ابدأ بتفاصيل شركتك",
        content: "أدخل اسم منظمتك هنا. هذا سيساعد في تخصيص التقرير لشركتك."
      },
      {
        title: "حدد قطاعك",
        content: "اذكر الصناعة أو القطاع الذي تعمل فيه الشركة للحصول على تحليل مقارن دقيق."
      },
      {
        title: "صف عملياتك",
        content: "هذا الحقل هو الأهم. كلما قدمت وصفًا أكثر تفصيلاً لعملياتك التشغيلية، كانت نتائج التحليل أعمق وأكثر فائدة."
      },
      {
        title: "احصل على تحليلك",
        content: "بعد ملء جميع الحقول، انقر هنا. سيقوم الذكاء الاصطناعي بتحليل بياناتك وإنشاء تقرير شامل في ثوانٍ."
      },
      {
        title: "أنت الآن جاهز!",
        content: "ابدأ بإدخال بياناتك للحصول على رؤى استراتيجية تساعدك على تنمية أعمالك. بالتوفيق!"
      }
    ],
    skip: "تخطي",
    prev: "السابق",
    next: "التالي",
    finish: "إنهاء"
  },
  savedReports: {
    title: "التقارير المحفوظة",
    loading: "جاري تحميل تقاريرك...",
    noReports: "لا توجد تقارير محفوظة حتى الآن.",
    noReportsHint: "قم بإنشاء تحليل جديد وسيتم حفظه في حسابك للمستقبل.",
    viewTooltip: "عرض التقرير",
    deleteTooltip: "حذف التقرير",
  },
  pricing: {
    title: "اختر الباقة المثالية",
    subtitle: "طوّر أعمالك برؤى استراتيجية احترافية.",
    monthly: "شهري",
    yearly: "سنوي",
    save: "وفر",
    currentPlan: "باقتك الحالية",
    plans: {
      free: {
        name: "بداية",
        desc: "أدوات أساسية للشركات الصغيرة.",
        price: "مجاني",
        features: [
          "تحليل استراتيجي أساسي",
          "تقارير ملخصة",
          "حفظ تقرير واحد في السجل",
          "دعم المجتمع"
        ],
        cta: "ابدأ مجاناً"
      },
      pro: {
        name: "احترافي",
        desc: "رؤى متقدمة للشركات النامية.",
        price: "$49",
        features: [
          "تحليل Big-4 شامل",
          "عدد غير محدود من التقارير المحفوظة",
          "توليد السياسات المالية",
          "توليد إجراءات التشغيل (SOPs)",
          "تصدير PDF (بدون شعار)",
          "أولوية المعالجة بالذكاء الاصطناعي"
        ],
        cta: "رقِّ إلى الاحترافية"
      },
      enterprise: {
        name: "شركات كبرى",
        desc: "حلول مخصصة للمؤسسات الكبيرة.",
        price: "مخصص",
        features: [
          "مدير حساب مخصص",
          "تدريب نموذج ذكاء اصطناعي خاص",
          "وصول عبر API",
          "خيار النشر المحلي (On-premise)",
          "اتفاقية مستوى الخدمة (SLA)"
        ],
        cta: "تواصل مع المبيعات"
      }
    }
  }
};

const resources = {
  en: {
    translation: translationsEN
  },
  ar: {
    translation: translationsAR
  }
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'ar',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
    interpolation: {
      escapeValue: false, 
    },
    react: {
        useSuspense: false,
    }
  });

export default i18next;