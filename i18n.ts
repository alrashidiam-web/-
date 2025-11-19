import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const translationsEN = {
  app: {
    title: "Strategic Advisor",
    gbt: "GPT",
    subtitle: "Your AI-powered strategic consultant for enterprise analysis and process optimization.",
    footer: "© 2024 Strategic Advisor GPT. Powered by Google Gemini. All rights reserved.",
    errorBoundary: {
      title: "An Unexpected Error Occurred",
      message: "Sorry, something went wrong while displaying this part of the application. Please try again.",
      reset: "Start Over",
    },
    errorModal: {
        title: "An Error Occurred",
        jsonError: "Failed to parse the AI response. The format might be unexpected. Please adjust your inputs and try again.",
        networkError: "A network error occurred while connecting to the service. Please check your internet connection.",
        geminiError: "The AI service encountered an error. This might be due to high load or a temporary issue. Please wait a moment and try again.",
        bubble: {
            loadError: "Could not load your saved reports. Please check your connection and try again.",
            saveError: "Failed to save the report to your account. Please try again.",
            deleteError: "Could not delete the report. Please try again."
        },
        unknownError: "An unknown error occurred. Please try again later.",
    },
    startNewAnalysis: "New Analysis",
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
        content: "This field is the most important. The more detailed your description of your operational processes, the deeper and more useful the analysis results will be."
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
  }
};

const translationsAR = {
  app: {
    title: "المستشار الاستراتيجي",
    gbt: "GPT",
    subtitle: "مستشارك الاستراتيجي المدعوم بالذكاء الاصطناعي لتحليل المؤسسات وتحسين العمليات.",
    footer: "© 2024 المستشار الاستراتيجي GPT. مدعوم بواسطة Google Gemini. جميع الحقوق محفوظة.",
    errorBoundary: {
      title: "حدث خطأ غير متوقع",
      message: "عذرًا، حدث خطأ ما أثناء عرض هذا الجزء من التطبيق. يرجى المحاولة مرة أخرى.",
      reset: "ابدأ من جديد",
    },
    errorModal: {
        title: "حدث خطأ",
        jsonError: "فشل في تحليل استجابة الذكاء الاصطناعي. قد يكون التنسيق غير متوقع. يرجى تعديل المدخلات والمحاولة مرة أخرى.",
        networkError: "حدث خطأ في الشبكة أثناء الاتصال بالخدمة. يرجى التحقق من اتصالك بالإنترنت.",
        geminiError: "واجهت خدمة الذكاء الاصطناعي خطأ. قد يكون هذا بسبب الحمل الزائد أو مشكلة مؤقتة. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.",
        bubble: {
            loadError: "تعذر تحميل تقاريرك المحفوظة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
            saveError: "فشل حفظ التقرير في حسابك. يرجى المحاولة مرة أخرى.",
            deleteError: "تعذر حذف التقرير. يرجى المحاولة مرة أخرى."
        },
        unknownError: "حدث خطأ غير معروف. يرجى المحاولة مرة أخرى لاحقًا.",
    },
    startNewAnalysis: "تحليل جديد",
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