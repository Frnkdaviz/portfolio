// Default portfolio data — override via Admin Panel (saved to localStorage)
const DEFAULT_DATA = {
  profile: {
    name: "Frank Davis Narh",
    title: "Network Operations Engineer",
    heroBadge: "NETWORK OPERATIONS ENGINEER",
    heroHeadline: "Expert Network\nEngineer",
    heroSub: "I monitor, maintain, and troubleshoot robust network infrastructures — keeping uptime high and outage durations low.",
    summary: "A dedicated Network Engineer with strong expertise in monitoring, maintaining, troubleshooting and optimizing networks.",
    yearsExperience: "4+",
    nodesManaged: "100+",
    certCount: "3",
    ongoingLearning: "Currently preparing for CCNA certification (Cisco Systems) and Google Professional Cloud Network Engineer."
  },

  // Section visibility & order — id must match the section key used throughout
  sections: [
    { id: "home",        label: "Dashboard",         visible: true },
    { id: "projects",    label: "Projects",           visible: true },
    { id: "simulations", label: "Network Simulations",visible: true },
    { id: "skills",      label: "Skills",             visible: true },
    { id: "experience",  label: "Experience",         visible: true },
    { id: "certifications", label: "Certifications",  visible: true },
    { id: "contact",     label: "Contact",            visible: true }
  ],

  roles: ["Network Engineer","Network Operations Center Engineer","Network Infrastructure Engineer","Data Center Engineer","NOC Lead"],

  skills: [
    { name: "Network Monitoring",                    level: 95 },
    { name: "TCP/IP & Routing Protocols",             level: 90 },
    { name: "Incident Management",                    level: 92 },
    { name: "MPLS / GPON / DWDM",                     level: 85 },
    { name: "Routing & Switching",                    level: 87 },
    { name: "Data Center Operations",                 level: 82 },
    { name: "Network Documentation",                  level: 88 },
    { name: "Fiber Optics",                           level: 80 },
    { name: "Network Infrastructure Troubleshooting", level: 90 },
    { name: "Customer Support & Communication",       level: 86 }
  ],

  monitoringTools: [
    { name: "SolarWinds",    desc: "Advanced performance monitoring and configuration management for enterprise networks.",  logo: "solar.png",  logoDark: false },
    { name: "Zabbix",        desc: "Open-source enterprise network monitoring with custom alerting and dashboards.",          logo: "https://assets.zabbix.com/img/logo/zabbix_logo_500x131.png", logoDark: true },
    { name: "Cacti",         desc: "Network graphing and data collection using RRDtool for trend analysis.",                 logo: "cacti.png",  logoDark: false },
    { name: "Adva Ensemble", desc: "Optical network management and real-time service monitoring platform.",                  logo: "adva.png",   logoDark: true },
    { name: "Nokia AMS",     desc: "Broadband access management system for subscriber and device control.",                  logo: "nokia.png",  logoDark: false },
    { name: "Nokia NFMP",    desc: "Network and fault management platform for carrier-grade infrastructure.",                logo: "nokia.png",  logoDark: false }
  ],

  certifications: [
    { name: "Certified in Cybersecurity",   issuer: "(ISC)²",              duration: "2023 – 2026",    logo: "https://www.isc2.org/content/dam/isc2/images/logos/isc2-logo.png" },
    { name: "AWS Cloud Practitioner",       issuer: "Amazon Web Services", duration: "2023 – 2026",    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "CCNA – Routing & Switching",   issuer: "Cisco Systems",       duration: "2022 – Present", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg" }
  ],

  projects: [
    { title: "Enterprise NOC Dashboard",  desc: "Designed and deployed a centralised NOC dashboard integrating SolarWinds and Zabbix telemetry for real-time visibility across 100+ nodes. Reduced mean-time-to-detect (MTTD) by 40% through customised threshold alerts and escalation workflows. Trained junior NOC staff on dashboard usage and alert response procedures.",  tags: ["SolarWinds","Zabbix","Monitoring","NOC"],       image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", link: "" },
    { title: "GPON Fibre Rollout",        desc: "Coordinated end-to-end GPON fibre deployment across 3 districts in Ghana — route planning, splicing, OLT configuration and subscriber provisioning. Managed a team of 6 field technicians and liaised with local government bodies for right-of-way permits.",                                                              tags: ["GPON","Fibre Optics","Nokia AMS","Deployment"], image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80", link: "" },
    { title: "Data Centre Reliability",   desc: "Led a preventive maintenance programme for a Tier-2 data centre — cooling audits, UPS checks, generator runs — achieving 99.9% uptime over 12 months. Developed a structured maintenance schedule and documented all procedures in a runbook.",                                                                         tags: ["Data Centre","Infrastructure","Reliability"],   image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80", link: "" },
    { title: "MPLS Core Network Upgrade", desc: "Supported migration from legacy TDM to MPLS-based core, including traffic engineering, route policy configuration and cutover planning with zero service disruption. Coordinated with 3 vendors and produced detailed change-management documentation throughout.",                                                       tags: ["MPLS","Cisco IOS","Migration","Routing"],       image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80", link: "" }
  ],

  simulations: [
    { title: "OSPF Multi-Area Network",    desc: "A Cisco Packet Tracer simulation demonstrating OSPF multi-area routing across a 3-tier enterprise topology. Includes ABR configuration, route summarisation and inter-area path optimisation.",  tags: ["OSPF","Packet Tracer","Routing","Cisco"], link: "https://github.com/franknarh" },
    { title: "VLAN Segmentation Lab",      desc: "GNS3 lab simulating VLAN segmentation across a campus network — inter-VLAN routing via Layer 3 switch, trunk port configuration and ACL-based security policies between departments.",          tags: ["VLAN","GNS3","Switching","Security"],     link: "https://github.com/franknarh" },
    { title: "BGP Peering Simulation",     desc: "eBGP peering simulation between two autonomous systems, demonstrating route advertisement, prefix filtering and MED attribute manipulation to influence inbound traffic paths.",                   tags: ["BGP","eBGP","Routing","WAN"],             link: "" }
  ],

  experience: [
    {
      company: "CSQUARED", role: "Network Operations Engineer", period: "Apr 2024 – Present", location: "Accra, Ghana",
      bullets: ["Monitor network performance using Nokia NFMP, Cacti and Adva Ensemble.","Troubleshoot service outages and resolve customer issues, ensuring timely restoration of services.","Ensure data center reliability — monitoring cooling systems and conducting weekly backup generator inspections.","Coordinate with vendors and internal field teams for troubleshooting and site maintenance.","Track deployed hardware inventory including serial numbers and warranty information.","Upgrade systems to latest versions to improve performance, compatibility and security."]
    },
    {
      company: "SEATEC TELECOM SERVICES LIMITED", role: "Network / Telecom Engineer", period: "Nov 2022 – Mar 2024", location: "Tema, Ghana",
      bullets: ["Assisted in designing and implementing network infrastructure — switches, routers, access points.","Collaborated with teams to plan and execute network upgrades and new deployments.","Documented network configurations, procedures, and troubleshooting guides.","Provided technical support and training to end-users and colleagues.","Conducted routine maintenance and fault resolution at customer organisations across Ghana."]
    }
  ],

  contact: {
    email: "frankdavisnarh@gmail.com",
    phone: "+233-531035950",
    location: "Accra, Ghana",
    availability: "Open to remote & on-site roles",
    linkedin: "https://www.linkedin.com/in/franknarh/",
    github: "https://github.com/franknarh"
  },

  theme: {
    light: {
      bg:      "#F9FAFB",
      card:    "#FFFFFF",
      accent:  "#2563EB",
      accent2: "#06B6D4",
      text:    "#111827",
      text2:   "#4B5563"
    },
    dark: {
      bg:      "#0B0F19",
      card:    "#111827",
      accent:  "#3B82F6",
      accent2: "#22D3EE",
      text:    "#E5E7EB",
      text2:   "#9CA3AF"
    }
  }
};
