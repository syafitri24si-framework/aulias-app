const customers = [
  // ========== MEMBERS ==========
  { id: 1, name: "Aulia Syafitri", email: "aulia@rotte.com", phone: "081234567890", loyalty: "Gold", points: 1250, totalSpent: 2500000, joinDate: "2024-01-15" },
  { id: 2, name: "Fitriana Tasya", email: "fitri@rotte.com", phone: "081234567891", loyalty: "Silver", points: 750, totalSpent: 1500000, joinDate: "2024-02-20" },
  { id: 3, name: "Givo Fadillah", email: "givo@rotte.com", phone: "081234567892", loyalty: "Gold", points: 2100, totalSpent: 4200000, joinDate: "2023-11-10" },
  { id: 4, name: "Budi Santoso", email: "budi@email.com", phone: "081234567893", loyalty: "Bronze", points: 120, totalSpent: 240000, joinDate: "2024-03-05" },
  { id: 5, name: "Siti Aminah", email: "siti@email.com", phone: "081234567894", loyalty: "Silver", points: 480, totalSpent: 960000, joinDate: "2024-01-25" },
  { id: 6, name: "Rizki Ramadhan", email: "rizki@email.com", phone: "081234567895", loyalty: "None", points: 0, totalSpent: 160000, joinDate: "2024-04-10" },
  { id: 7, name: "Dewi Lestari", email: "dewi@email.com", phone: "081234567896", loyalty: "Gold", points: 1850, totalSpent: 3700000, joinDate: "2023-12-01" },
  { id: 8, name: "Andi Wijaya", email: "andi@email.com", phone: "081234567897", loyalty: "None", points: 0, totalSpent: 1240000, joinDate: "2024-02-14" },
  { id: 9, name: "Maya Sari", email: "maya@email.com", phone: "081234567898", loyalty: "Bronze", points: 200, totalSpent: 400000, joinDate: "2024-03-20" },
  { id: 10, name: "Rudi Hartono", email: "rudi@email.com", phone: "081234567899", loyalty: "Gold", points: 3000, totalSpent: 6000000, joinDate: "2023-10-05" },
  { id: 11, name: "Lina Marlia", email: "lina@email.com", phone: "081234567800", loyalty: "Silver", points: 550, totalSpent: 1100000, joinDate: "2024-01-18" },
  { id: 12, name: "Eko Prasetyo", email: "eko@email.com", phone: "081234567801", loyalty: "None", points: 0, totalSpent: 180000, joinDate: "2024-04-22" },
  { id: 13, name: "Rina Haryati", email: "rina@email.com", phone: "081234567802", loyalty: "Gold", points: 1420, totalSpent: 2840000, joinDate: "2023-12-12" },
  { id: 14, name: "Agus Salim", email: "agus@email.com", phone: "081234567803", loyalty: "None", points: 0, totalSpent: 760000, joinDate: "2024-02-28" },
  { id: 15, name: "Nadia Kirana", email: "nadia@email.com", phone: "081234567804", loyalty: "Gold", points: 2200, totalSpent: 4400000, joinDate: "2023-09-15" },
  { id: 16, name: "Faisal Rahman", email: "faisal@email.com", phone: "081234567805", loyalty: "None", points: 0, totalSpent: 120000, joinDate: "2024-04-05" },
  { id: 17, name: "Yuli Astuti", email: "yuli@email.com", phone: "081234567806", loyalty: "Silver", points: 890, totalSpent: 1780000, joinDate: "2024-01-30" },
  { id: 18, name: "Hendra Gunawan", email: "hendra@email.com", phone: "081234567807", loyalty: "Gold", points: 1670, totalSpent: 3340000, joinDate: "2023-11-20" },
  { id: 19, name: "Reni Andriani", email: "reni@email.com", phone: "081234567808", loyalty: "Bronze", points: 150, totalSpent: 300000, joinDate: "2024-03-12" },
  { id: 20, name: "Dian Purnama", email: "dian@email.com", phone: "081234567809", loyalty: "None", points: 0, totalSpent: 1420000, joinDate: "2024-02-05" },
  { id: 21, name: "Rizka Amalia", email: "rizka@email.com", phone: "081234567810", loyalty: "Gold", points: 1950, totalSpent: 3900000, joinDate: "2023-10-25" },
  { id: 22, name: "Irfan Hakim", email: "irfan@email.com", phone: "081234567811", loyalty: "None", points: 0, totalSpent: 80000, joinDate: "2024-04-18" },
  { id: 23, name: "Winda Sari", email: "winda@email.com", phone: "081234567812", loyalty: "Silver", points: 430, totalSpent: 860000, joinDate: "2024-03-01" },
  { id: 24, name: "Bayu Saputra", email: "bayu@email.com", phone: "081234567813", loyalty: "Gold", points: 2750, totalSpent: 5500000, joinDate: "2023-08-14" },
  { id: 25, name: "Cindy Claramitha", email: "cindy@email.com", phone: "081234567814", loyalty: "None", points: 0, totalSpent: 1020000, joinDate: "2024-02-22" },
  { id: 26, name: "Doni Salman", email: "doni@email.com", phone: "081234567815", loyalty: "Bronze", points: 110, totalSpent: 220000, joinDate: "2024-04-01" },
  { id: 27, name: "Elsa Maharani", email: "elsa@email.com", phone: "081234567816", loyalty: "Gold", points: 3100, totalSpent: 6200000, joinDate: "2023-07-09" },
  { id: 28, name: "Fajar Nugroho", email: "fajar@email.com", phone: "081234567817", loyalty: "None", points: 0, totalSpent: 1340000, joinDate: "2024-01-12" },
  { id: 29, name: "Gita Permatasari", email: "gita@email.com", phone: "081234567818", loyalty: "Gold", points: 2380, totalSpent: 4760000, joinDate: "2023-09-30" },
  { id: 30, name: "Hilman Fauzi", email: "hilman@email.com", phone: "081234567819", loyalty: "None", points: 0, totalSpent: 150000, joinDate: "2024-04-25" },
];


export default customers;

