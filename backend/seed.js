const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user");
const Product = require("./models/product");
const connectDB = require("./config/db");

dotenv.config();

// Kolkata-based student sellers across prominent college areas
const demoSellers = [
  { name: "Sourav Ganguly", email: "sourav.cse@nearnest.demo", location: "Salt Lake Sector V (Near Techno India & IEM)", coords: [88.4285, 22.5804] },
  { name: "Deblina Banerjee", email: "deblina.ju@nearnest.demo", location: "Jadavpur University Main Campus (Gate 4)", coords: [88.3718, 22.4988] },
  { name: "Aniket Mukherjee", email: "aniket.cu@nearnest.demo", location: "College Street Boi Para (Opp. Presidency)", coords: [88.3639, 22.5744] },
  { name: "Sayani Das", email: "sayani.newtown@nearnest.demo", location: "Newtown Action Area 1 (Near Amity Gate 2)", coords: [88.4721, 22.5867] },
  { name: "Rajarshi Ghosh", email: "rajarshi.iiest@nearnest.demo", location: "Shibpur, Howrah (Near IIEST Campus)", coords: [88.3072, 22.5552] },
  { name: "Poulomi Chatterjee", email: "poulomi.heritage@nearnest.demo", location: "Ruby / Anandapur (Near Heritage Institute)", coords: [88.4067, 22.5186] },
  { name: "Subhamita Sen", email: "subhamita.nsec@nearnest.demo", location: "Garia Station Road (Near NSEC Campus)", coords: [88.3842, 22.4635] },
  { name: "Aritra Paul", email: "aritra.ece@nearnest.demo", location: "Ultadanga HUDCO (Near Bidhan Nagar Stn)", coords: [88.3879, 22.5888] },
  { name: "Tanmoy Bhowmick", email: "tanmoy.it@nearnest.demo", location: "Ballygunge Circular Road (CU Science Campus)", coords: [88.3634, 22.5312] },
  { name: "Rima Chakraborty", email: "rima.ceramic@nearnest.demo", location: "Dunlop / Belgharia (Near GCECT / BT Road)", coords: [88.3792, 22.6548] },
  { name: "Sayan Bhattacharya", email: "sayan.nit@nearnest.demo", location: "Madhyamgram (Near Narula Institute)", coords: [88.4526, 22.6953] },
  { name: "Swarnali Roy", email: "swarnali.saltlake@nearnest.demo", location: "Salt Lake Sector 1 (Near City Centre 1)", coords: [88.4069, 22.5898] },
];

// 35 curated B.Tech engineering student products located across Kolkata
const catalogProducts = [
  // 1. Textbooks — Core CS / IT / Engineering
  {
    title: "Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan",
    description: "The standard B.Tech 3rd semester DBMS Bible. Clean pages with minimal pencil highlights in Relational Algebra and Normalization (BCNF, 3NF). No torn pages.",
    price: 380,
    listingType: "sell",
    category: "Textbooks",
    condition: "Good",
    location: "Salt Lake Sector V (Near Techno India & IEM)",
    coordinates: [88.4285, 22.5804],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sourav.cse@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 21,
    reliabilityScore: "98%",
  },
  {
    title: "Computer System Architecture (3rd Ed) - M. Morris Mano",
    description: "Essential for 2nd/3rd year Computer Architecture and Organization (CAO). Covers CPU architecture, instruction cycles, micro-programmed control, and memory hierarchy.",
    price: 280,
    listingType: "sell",
    category: "Textbooks",
    condition: "Like New",
    location: "College Street Boi Para (Opp. Presidency)",
    coordinates: [88.3639, 22.5744],
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "aniket.cu@nearnest.demo",
    sellerRating: 5.0,
    sellerTrades: 38,
    reliabilityScore: "100%",
  },
  {
    title: "Operating System Concepts (10th Ed Dinosaur Book) - Silberschatz & Galvin",
    description: "Complete reference for OS course, covering process synchronization, semaphores, deadlock algorithms, paging, and virtual memory. Perfect condition.",
    price: 420,
    listingType: "sell",
    category: "Textbooks",
    condition: "Good",
    location: "Jadavpur University Main Campus (Gate 4)",
    coordinates: [88.3718, 22.4988],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "deblina.ju@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 17,
    reliabilityScore: "99%",
  },
  {
    title: "Introduction to Algorithms (4th Ed) - CLRS (Cormen, Leiserson, Rivest, Stein)",
    description: "Available for semester or weekly rental for DAA exams & coding interview prep. Complete algorithm proofs, dynamic programming, and graph theory.",
    price: 40,
    listingType: "rent",
    category: "Textbooks",
    condition: "Like New",
    location: "Newtown Action Area 1 (Near Amity Gate 2)",
    coordinates: [88.4721, 22.5867],
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sayani.newtown@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 14,
    reliabilityScore: "96%",
  },
  {
    title: "Computer Networking: A Top-Down Approach (7th Ed) - Kurose & Ross",
    description: "Top reference book for Computer Networks covering TCP/IP, UDP sockets, routing algorithms, DNS, and HTTP/2 protocols. Crisp binding.",
    price: 340,
    listingType: "sell",
    category: "Textbooks",
    condition: "Like New",
    location: "Shibpur, Howrah (Near IIEST Campus)",
    coordinates: [88.3072, 22.5552],
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "rajarshi.iiest@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 19,
    reliabilityScore: "98%",
  },
  {
    title: "Compilers: Principles, Techniques, and Tools (Dragon Book) - Aho & Ullman",
    description: "The definitive compiler design textbook for B.Tech 6th sem. Covers lexical analysis, LL/LR parsing tables, intermediate code, and DAG optimization.",
    price: 350,
    listingType: "sell",
    category: "Textbooks",
    condition: "Good",
    location: "Ruby / Anandapur (Near Heritage Institute)",
    coordinates: [88.4067, 22.5186],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "poulomi.heritage@nearnest.demo",
    sellerRating: 4.7,
    sellerTrades: 11,
    reliabilityScore: "95%",
  },
  {
    title: "Higher Engineering Mathematics (44th Edition) - B.S. Grewal",
    description: "Free donation to any 1st year B.Tech fresher! Covers calculus, ODE/PDE, Fourier transforms, Laplace transforms, and complex variables. Pay it forward!",
    price: 0,
    listingType: "donate",
    category: "Textbooks",
    condition: "Good",
    location: "College Street Boi Para (Opp. Presidency)",
    coordinates: [88.3639, 22.5744],
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "aniket.cu@nearnest.demo",
    sellerRating: 5.0,
    sellerTrades: 38,
    reliabilityScore: "100%",
  },
  {
    title: "Digital Logic and Computer Design - M. Morris Mano",
    description: "Standard 2nd semester foundation textbook for Karnaugh maps, combinational circuits, multiplexers, flip-flops, registers, and counters.",
    price: 230,
    listingType: "sell",
    category: "Textbooks",
    condition: "Good",
    location: "Garia Station Road (Near NSEC Campus)",
    coordinates: [88.3842, 22.4635],
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "subhamita.nsec@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 15,
    reliabilityScore: "97%",
  },
  {
    title: "Introduction to the Theory of Computation (3rd Edition) - Michael Sipser",
    description: "The clearest TOC textbook for DFA, NFA, context-free grammars, pushdown automata, Turing machines, and NP-completeness.",
    price: 290,
    listingType: "sell",
    category: "Textbooks",
    condition: "Like New",
    location: "Ultadanga HUDCO (Near Bidhan Nagar Stn)",
    coordinates: [88.3879, 22.5888],
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "aritra.ece@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 16,
    reliabilityScore: "96%",
  },
  {
    title: "Software Engineering: A Practitioner's Approach (8th Ed) - Roger S. Pressman",
    description: "Donating for any senior or junior preparing for software engineering exam. Covers Agile, Scrum, UML design diagrams, and software metrics.",
    price: 0,
    listingType: "donate",
    category: "Textbooks",
    condition: "Good",
    location: "Jadavpur University Main Campus (Gate 4)",
    coordinates: [88.3718, 22.4988],
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "deblina.ju@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 17,
    reliabilityScore: "99%",
  },
  {
    title: "Discrete Mathematics and Its Applications (8th Edition) - Kenneth H. Rosen",
    description: "In-depth reference for predicate logic, graph theory, tree traversals, recurrence relations, and Boolean algebra. Original Pearson edition.",
    price: 340,
    listingType: "sell",
    category: "Textbooks",
    condition: "Like New",
    location: "Ballygunge Circular Road (CU Science Campus)",
    coordinates: [88.3634, 22.5312],
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "tanmoy.it@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 22,
    reliabilityScore: "98%",
  },
  {
    title: "Signals and Systems (2nd Edition) - Alan V. Oppenheim & Alan S. Willsky",
    description: "Crucial for ECE, EE, and Instrumentation engineering. Continuous and discrete-time signals, LTI systems, DTFT, and Z-transforms.",
    price: 310,
    listingType: "sell",
    category: "Textbooks",
    condition: "Good",
    location: "Dunlop / Belgharia (Near GCECT / BT Road)",
    coordinates: [88.3792, 22.6548],
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "rima.ceramic@nearnest.demo",
    sellerRating: 4.6,
    sellerTrades: 9,
    reliabilityScore: "93%",
  },

  // 2. Electronics & Lab Hardware Kits
  {
    title: "Casio fx-991EX ClassWiz Scientific Calculator (MAKAUT Exam Approved)",
    description: "High-resolution spreadsheet, matrix up to 4x4, equation solver, polynomial calculations. Battery in perfect shape with slide-on case. Rent per exam day or week.",
    price: 35,
    listingType: "rent",
    category: "Electronics",
    condition: "Like New",
    location: "Salt Lake Sector V (Near Techno India & IEM)",
    coordinates: [88.4285, 22.5804],
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sourav.cse@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 21,
    reliabilityScore: "98%",
  },
  {
    title: "Arduino Uno R3 Ultimate Starter Kit (Sensors, Motors, LCD & Breadboard)",
    description: "Complete kit for microcontrollers lab and IoT mini-projects. Includes Uno board, ultrasonic sensor, IR module, 16x2 LCD display, servo motor, and USB cable.",
    price: 65,
    listingType: "rent",
    category: "Electronics",
    condition: "Like New",
    location: "Jadavpur University Main Campus (Gate 4)",
    coordinates: [88.3718, 22.4988],
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "deblina.ju@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 17,
    reliabilityScore: "99%",
  },
  {
    title: "Raspberry Pi 4 Model B (4GB RAM) with Official Case, Fan & 32GB SD Card",
    description: "Pre-loaded with Raspberry Pi OS. Perfect for B.Tech final year capstone projects, OpenCV computer vision, robotics, or home servers. Available for rent.",
    price: 110,
    listingType: "rent",
    category: "Electronics",
    condition: "Like New",
    location: "Newtown Action Area 1 (Near Amity Gate 2)",
    coordinates: [88.4721, 22.5867],
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sayani.newtown@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 14,
    reliabilityScore: "96%",
  },
  {
    title: "Digital Multimeter DT830D with Heavy-Duty Test Probes & 9V Battery",
    description: "Measures DC/AC voltage, DC current, resistance, diode check, and transistor hFE test. Essential for Basic Electrical Engineering (BEE) lab.",
    price: 180,
    listingType: "sell",
    category: "Electronics",
    condition: "Like New",
    location: "Shibpur, Howrah (Near IIEST Campus)",
    coordinates: [88.3072, 22.5552],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "rajarshi.iiest@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 19,
    reliabilityScore: "98%",
  },
  {
    title: "25W Soldering Iron Station with Stand, Solder Wire & Desoldering Pump",
    description: "High efficiency pointed copper tip, heat-resistant grip, sponge stand, 50g lead-free solder wire. Used once for 3rd sem hardware project.",
    price: 240,
    listingType: "sell",
    category: "Electronics",
    condition: "Good",
    location: "Ruby / Anandapur (Near Heritage Institute)",
    coordinates: [88.4067, 22.5186],
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "poulomi.heritage@nearnest.demo",
    sellerRating: 4.7,
    sellerTrades: 11,
    reliabilityScore: "95%",
  },
  {
    title: "Breadboard 830 Points + 120-Piece Jumper Wire Bundle (M-M, M-F, F-F)",
    description: "Donating to any junior student starting Digital Electronics or Analog Circuits lab. Solderless breadboard in clean condition with full set of jumper wires.",
    price: 0,
    listingType: "donate",
    category: "Electronics",
    condition: "Good",
    location: "Garia Station Road (Near NSEC Campus)",
    coordinates: [88.3842, 22.4635],
    image: "https://images.unsplash.com/photo-1517055729441-db3aab9c8612?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "subhamita.nsec@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 15,
    reliabilityScore: "97%",
  },
  {
    title: "8085 / 8086 Microprocessor Trainer Kit with Power Adapter (Exam Prep)",
    description: "Hex keypad, 8-digit 7-segment display, 8255 PPI interface, bus extension. Rent for microprocessor lab practice and assembly language coding.",
    price: 90,
    listingType: "rent",
    category: "Electronics",
    condition: "Good",
    location: "Ultadanga HUDCO (Near Bidhan Nagar Stn)",
    coordinates: [88.3879, 22.5888],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "aritra.ece@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 16,
    reliabilityScore: "96%",
  },
  {
    title: "Cat6 High-Speed LAN Cable (10 Meter) for College Hostel Internet Ports",
    description: "Molded RJ45 connectors with gold-plated pins. Delivers full 1Gbps speed on hostel Ethernet wall jacks without WiFi drops during online hackathons.",
    price: 150,
    listingType: "sell",
    category: "Electronics",
    condition: "Like New",
    location: "Salt Lake Sector V (Near Techno India & IEM)",
    coordinates: [88.4285, 22.5804],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sourav.cse@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 21,
    reliabilityScore: "98%",
  },
  {
    title: "USB-C 7-in-1 Aluminium Hub (4K HDMI, 3x USB 3.0, SD Card Reader, 100W PD)",
    description: "Sleek space gray aluminum hub. Connect your laptop to lab monitors, projectors during seminar presentations, and pen drives simultaneously.",
    price: 620,
    listingType: "sell",
    category: "Electronics",
    condition: "Like New",
    location: "Salt Lake Sector 1 (Near City Centre 1)",
    coordinates: [88.4069, 22.5898],
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "swarnali.saltlake@nearnest.demo",
    sellerRating: 5.0,
    sellerTrades: 24,
    reliabilityScore: "100%",
  },
  {
    title: "Dual-Fan Laptop Cooling Pad with Blue LED & Adjustable Ergonomic Stand",
    description: "Keeps gaming laptops and coding workstations cool under heavy compile jobs or Android Studio builds. Dual silent 140mm fans with dual USB pass-through.",
    price: 340,
    listingType: "sell",
    category: "Electronics",
    condition: "Good",
    location: "Madhyamgram (Near Narula Institute)",
    coordinates: [88.4526, 22.6953],
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sayan.nit@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 13,
    reliabilityScore: "97%",
  },

  // 3. Clothing & Workshop / Drawing Tools
  {
    title: "White 100% Pure Cotton Lab Apron / Coat (Size 40 - L)",
    description: "Compulsory for 1st year Chemistry lab, Physics lab, and Workshop. Clean, washed, no chemical stains. Donating for free to any junior student!",
    price: 0,
    listingType: "donate",
    category: "Clothing",
    condition: "Good",
    location: "Jadavpur University Main Campus (Gate 4)",
    coordinates: [88.3718, 22.4988],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "deblina.ju@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 17,
    reliabilityScore: "99%",
  },
  {
    title: "Engineering Graphics Mini Drafter (Omega Steel Rods) with Clamp & Protractor",
    description: "Standard mini drafter for MAKAUT / JU Engineering Drawing (ED) lab. Metal arms are completely true and parallel. Comes in black zippered carrying bag.",
    price: 290,
    listingType: "sell",
    category: "Hostel Needs",
    condition: "Like New",
    location: "College Street Boi Para (Opp. Presidency)",
    coordinates: [88.3639, 22.5744],
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "aniket.cu@nearnest.demo",
    sellerRating: 5.0,
    sellerTrades: 38,
    reliabilityScore: "100%",
  },
  {
    title: "Half-Imperial Wooden Engineering Drawing Board (15x22 inch) with T-Square",
    description: "Pine wood drawing board with smooth surface and ebony edge. Giving away for free as I have completed my 1st year engineering drawing exams.",
    price: 0,
    listingType: "donate",
    category: "Hostel Needs",
    condition: "Good",
    location: "Shibpur, Howrah (Near IIEST Campus)",
    coordinates: [88.3072, 22.5552],
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "rajarshi.iiest@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 19,
    reliabilityScore: "98%",
  },
  {
    title: "Mechanical Workshop Safety Gloves & Polycarbonate Lab Goggles",
    description: "Required for carpentry, fitting, welding, and machine shop workshops in 1st/2nd semester. Certified impact-resistant clear eyewear and leather palm gloves.",
    price: 120,
    listingType: "sell",
    category: "Clothing",
    condition: "Like New",
    location: "Dunlop / Belgharia (Near GCECT / BT Road)",
    coordinates: [88.3792, 22.6548],
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "rima.ceramic@nearnest.demo",
    sellerRating: 4.6,
    sellerTrades: 9,
    reliabilityScore: "93%",
  },

  // 4. Hostel Needs & Living Essentials
  {
    title: "Prestige 1.5L Stainless Steel Electric Kettle (Hostel Night Study Essential)",
    description: "Auto shut-off, 360-degree swivel base, 1500W rapid boiling. Lifesaver for late-night exam prep, hot water, green tea, and 2 AM hostel Maggi!",
    price: 480,
    listingType: "sell",
    category: "Hostel Needs",
    condition: "Good",
    location: "Newtown Action Area 1 (Near Amity Gate 2)",
    coordinates: [88.4721, 22.5867],
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sayani.newtown@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 14,
    reliabilityScore: "96%",
  },
  {
    title: "Foldable Wooden Bed Study Table with iPad/Book Slot & Cup Holder",
    description: "Solid engineered wood top with curved ergonomic edges and sturdy aluminum legs. Folds flat. Perfect for coding or attending lectures in hostel bed.",
    price: 320,
    listingType: "sell",
    category: "Hostel Needs",
    condition: "Like New",
    location: "Ruby / Anandapur (Near Heritage Institute)",
    coordinates: [88.4067, 22.5186],
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "poulomi.heritage@nearnest.demo",
    sellerRating: 4.7,
    sellerTrades: 11,
    reliabilityScore: "95%",
  },
  {
    title: "Havells 4-Socket Surge Protector Spike Guard with 2-Meter Heavy Cable",
    description: "Individual switches with LED indicators and thermal overload protector. Safely plug in laptop charger, phone, table fan, and lamp in hostel room.",
    price: 260,
    listingType: "sell",
    category: "Hostel Needs",
    condition: "Like New",
    location: "Salt Lake Sector V (Near Techno India & IEM)",
    coordinates: [88.4285, 22.5804],
    image: "https://images.unsplash.com/photo-1544716278-e513176f20b5?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sourav.cse@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 21,
    reliabilityScore: "98%",
  },
  {
    title: "Single Bed High-Density Coir-Foam Mattress (36x72 inch) for Hostel Cot",
    description: "Moving out after graduation. Clean 4-inch firm orthopaedic mattress with removable washable zip cover. Fits all standard college hostel iron cots.",
    price: 750,
    listingType: "sell",
    category: "Hostel Needs",
    condition: "Good",
    location: "Jadavpur University Main Campus (Gate 4)",
    coordinates: [88.3718, 22.4988],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "deblina.ju@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 17,
    reliabilityScore: "99%",
  },
  {
    title: "Wipro 9W Rechargeable LED Emergency Desk Lamp with Eye-Care Dimmer",
    description: "Touch sensor control, 3 lighting modes (Warm, Cool, Natural), flexible gooseneck. 6-hour battery backup during hostel power cuts.",
    price: 290,
    listingType: "sell",
    category: "Hostel Needs",
    condition: "Like New",
    location: "Garia Station Road (Near NSEC Campus)",
    coordinates: [88.3842, 22.4635],
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "subhamita.nsec@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 15,
    reliabilityScore: "97%",
  },
  {
    title: "Foldable Stainless Steel Clothes Drying Stand for Hostel Balcony",
    description: "Rust-proof accordion clothes drying rack. Compact footprint, holds up to 15 kg of laundry. Easily tucks beside hostel cupboard when not in use.",
    price: 380,
    listingType: "sell",
    category: "Hostel Needs",
    condition: "Good",
    location: "Ballygunge Circular Road (CU Science Campus)",
    coordinates: [88.3634, 22.5312],
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "tanmoy.it@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 22,
    reliabilityScore: "98%",
  },

  // 5. Vehicles — Campus & Hostel Commute
  {
    title: "Hercules Roadeo 26T 21-Speed Geared Mountain Bicycle with Dual Disc Brakes",
    description: "Sturdy alloy frame with front suspension fork and Shimano thumb shifters. Ideal for daily commute from Salt Lake Sector V hostels to campus labs.",
    price: 90,
    listingType: "rent",
    category: "Vehicles",
    condition: "Good",
    location: "Salt Lake Sector V (Near Techno India & IEM)",
    coordinates: [88.4285, 22.5804],
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sourav.cse@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 21,
    reliabilityScore: "98%",
  },
  {
    title: "Hero Sprint Single-Speed Commuter Bicycle with Front Wire Basket & Lock",
    description: "Low-maintenance city bike with brand new tires, comfortable spring saddle, and bell. Perfect for quick trips to Jadavpur 8B bus stand and markets.",
    price: 2100,
    listingType: "sell",
    category: "Vehicles",
    condition: "Good",
    location: "Jadavpur University Main Campus (Gate 4)",
    coordinates: [88.3718, 22.4988],
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "deblina.ju@nearnest.demo",
    sellerRating: 4.9,
    sellerTrades: 17,
    reliabilityScore: "99%",
  },
  {
    title: "Avon City Liner Cycle with Chain Guard (Rent for Campus & Hostel Commute)",
    description: "Smooth pedaling campus cycle available on daily or weekly rental. Includes heavy combination cable lock and mudguards. Available immediately in Newtown.",
    price: 45,
    listingType: "rent",
    category: "Vehicles",
    condition: "Like New",
    location: "Newtown Action Area 1 (Near Amity Gate 2)",
    coordinates: [88.4721, 22.5867],
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80",
    sellerEmail: "sayani.newtown@nearnest.demo",
    sellerRating: 4.8,
    sellerTrades: 14,
    reliabilityScore: "96%",
  },
];

async function seedDatabase(options = { clearExisting: false }) {
  const defaultPassword = await bcrypt.hash("DemoUser123!", 10);
  const sellerMap = {};

  // 1. Create or get demo sellers
  for (const s of demoSellers) {
    let user = await User.findOne({ email: s.email });
    if (!user) {
      user = await User.create({
        name: s.name,
        email: s.email,
        password: defaultPassword,
        isVerified: true,
        location: {
          type: "Point",
          coordinates: s.coords,
        },
      });
    }
    sellerMap[s.email] = user._id;
  }

  // 2. Optionally clear existing demo products if requested
  if (options.clearExisting) {
    const demoUsers = await User.find({ email: { $regex: "@nearnest\\.demo$" } });
    const demoIds = demoUsers.map((u) => u._id);
    await Product.deleteMany({ seller: { $in: demoIds } });
  }

  // 3. Insert catalog products if not already present
  let seededCount = 0;
  for (const item of catalogProducts) {
    const sellerId = sellerMap[item.sellerEmail];
    if (!sellerId) continue;

    const exists = await Product.findOne({ title: item.title, seller: sellerId });
    if (!exists) {
      await Product.create({
        seller: sellerId,
        title: item.title,
        description: item.description,
        price: item.price,
        listingType: item.listingType,
        category: item.category,
        condition: item.condition,
        location: item.location,
        coordinates: item.coordinates,
        image: item.image,
        sellerRating: item.sellerRating,
        sellerTrades: item.sellerTrades,
        reliabilityScore: item.reliabilityScore,
        status: "available",
      });
      seededCount++;
    }
  }

  return { seededCount, totalCatalog: catalogProducts.length };
}

// Automatically runs on server start if database has 0 products
async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log("No products found in database. Auto-seeding initial marketplace catalog...");
    const result = await seedDatabase();
    console.log(`Seeded ${result.seededCount} initial marketplace products successfully.`);
  }

  const NeedRequest = require("./models/needRequest");
  const needCount = await NeedRequest.countDocuments();
  if (needCount === 0) {
    const firstUser = await User.findOne();
    if (firstUser) {
      await NeedRequest.create([
        {
          requester: firstUser._id,
          title: "Casio fx-991ES Plus Scientific Calculator",
          description: "Need one for 3 days for upcoming semester engineering exams.",
          budget: "₹50 / day",
          category: "Electronics",
          location: "Salt Lake Sector V",
        },
        {
          requester: firstUser._id,
          title: "Single Burner Induction Cooktop",
          description: "Looking for a working induction stove for 1 week while family visits.",
          budget: "₹60 / day",
          category: "Appliances",
          location: "Jadavpur University Area",
        },
        {
          requester: firstUser._id,
          title: "Engineering Mini Drafter & Sheet Tube",
          description: "Need for Engineering Graphics lab practical exam this Friday morning.",
          budget: "₹40 / day",
          category: "Study Equipment",
          location: "College Street Area",
        },
      ]);
      console.log("Seeded initial community requests into MongoDB successfully.");
    }
  }
}

if (require.main === module) {
  connectDB().then(async () => {
    try {
      console.log("Seeding database with 35 Kolkata B.Tech student listings...");
      const result = await seedDatabase({ clearExisting: true });
      console.log(`Done! Seeded ${result.seededCount} products into MongoDB.`);
      process.exit(0);
    } catch (err) {
      console.error("Seeding failed:", err);
      process.exit(1);
    }
  });
}

module.exports = { seedDatabase, seedIfEmpty };
