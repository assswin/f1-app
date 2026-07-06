const rawDrivers = [
  { id: 'max-verstappen', name: 'Max Verstappen', team: 'Oracle Red Bull Racing', country: 'Netherlands', image: '/assets/driver/max-verstappen-f1-driver-profile-picture.webp', number: 1, bio: 'Four-time World Champion known for his aggressive driving and exceptional race pace.', stats: { wins: 71, podiums: 111, championships: 4, poles: 48 } },
  { id: 'sergio-perez', name: 'Sergio Perez', team: 'Cadillac F1 Team', country: 'Mexico', image: '/assets/driver/sergio-perez-f1-driver-profile-picture.webp', number: 11, bio: 'Experienced driver nicknamed the "Minister of Defence" for his great tire management and defending skills.', stats: { wins: 6, podiums: 35, championships: 0, poles: 3 } },
  { id: 'lewis-hamilton', name: 'Lewis Hamilton', team: 'Scuderia Ferrari', country: 'United Kingdom', image: '/assets/driver/lewis-hamilton-f1-driver-profile-picture.webp', number: 44, bio: 'Seven-time World Champion, statistically the most successful driver in F1 history.', stats: { wins: 105, podiums: 201, championships: 7, poles: 104 } },
  { id: 'charles-leclerc', name: 'Charles Leclerc', team: 'Scuderia Ferrari', country: 'Monaco', image: '/assets/driver/charles-leclerc-f1-driver-profile-picture.webp', number: 16, bio: 'A prodigy from Monaco with blistering qualifying pace and a deep connection to Ferrari.', stats: { wins: 8, podiums: 41, championships: 0, poles: 26 } },
  { id: 'lando-norris', name: 'Lando Norris', team: 'McLaren Formula 1 Team', country: 'United Kingdom', image: '/assets/driver/lando-norris-f1-driver-profile-picture.webp', number: 4, bio: 'Quick and consistent, leading McLaren\'s resurgence with incredible talent and popular off-track persona.', stats: { wins: 3, podiums: 25, championships: 0, poles: 8 } },
  { id: 'oscar-piastri', name: 'Oscar Piastri', team: 'McLaren Formula 1 Team', country: 'Australia', image: '/assets/driver/oscar-piastri-f1-driver-profile-picture.webp', number: 81, bio: 'A highly rated young talent who impressed tremendously in his rookie season.', stats: { wins: 0, podiums: 2, championships: 0, poles: 0 } },
  { id: 'george-russell', name: 'George Russell', team: 'Mercedes-AMG Petronas F1 Team', country: 'United Kingdom', image: '/assets/driver/george-russell-f1-driver-profile-picture.webp', number: 63, bio: 'Mr. Consistency, highly dependable driver looking to bring Mercedes back to the top.', stats: { wins: 1, podiums: 11, championships: 0, poles: 1 } },
  { id: 'kimi-antonelli', name: 'Kimi Antonelli', team: 'Mercedes-AMG Petronas F1 Team', country: 'Italy', image: '/assets/driver/kimi-antonelli-f1-driver-profile-picture.webp', number: 12, bio: 'The much-hyped rookie stepping into Mercedes with lightning speed and junior category dominance.', stats: { wins: 0, podiums: 0, championships: 0, poles: 0 } },
  { id: 'fernando-alonso', name: 'Fernando Alonso', team: 'Aston Martin Aramco F1 Team', country: 'Spain', image: '/assets/driver/fernando-alonso-f1-driver-profile-picture.webp', number: 14, bio: 'Two-time World Champion, a veteran showing that age is just a number with incredible defensive drives.', stats: { wins: 32, podiums: 106, championships: 2, poles: 22 } },
  { id: 'lance-stroll', name: 'Lance Stroll', team: 'Aston Martin Aramco F1 Team', country: 'Canada', image: '/assets/driver/lance-stroll-f1-driver-profile-picture.webp', number: 18, bio: 'Experienced racer entering his ninth season in Formula 1.', stats: { wins: 0, podiums: 3, championships: 0, poles: 1 } },
  { id: 'alex-albon', name: 'Alex Albon', team: 'Williams Racing', country: 'Thailand', image: '/assets/driver/alex-albon-f1-driver-profile-picture.webp', number: 23, bio: 'Revitalized at Williams, showing brilliant one-lap pace and extracting everything from the car.', stats: { wins: 0, podiums: 2, championships: 0, poles: 0 } },
  { id: 'franco-colapinto', name: 'Franco Colapinto', team: 'BWT Alpine F1 Team', country: 'Argentina', image: '/assets/driver/franco-colapinto-f1-driver-profile-picture.webp', number: 43, bio: 'A rising star from Argentina looking to make his mark at Alpine.', stats: { wins: 0, podiums: 0, championships: 0, poles: 0 } },
  { id: 'pierre-gasly', name: 'Pierre Gasly', team: 'BWT Alpine F1 Team', country: 'France', image: '/assets/driver/pierre-gasly-f1-driver-profile-picture.webp', number: 10, bio: 'A race winner with Alpine, reliable and fast, forming an all-French lineup.', stats: { wins: 1, podiums: 4, championships: 0, poles: 0 } },
  { id: 'esteban-ocon', name: 'Esteban Ocon', team: 'MoneyGram Haas F1 Team', country: 'France', image: '/assets/driver/esteban-ocon-f1-driver-profile-picture.webp', number: 31, bio: 'Fiercely competitive driver known for elbows-out racing and consistency.', stats: { wins: 1, podiums: 3, championships: 0, poles: 0 } },
  { id: 'nico-hulkenberg', name: 'Nico Hulkenberg', team: 'Audi Formula Racing', country: 'Germany', image: '/assets/driver/nico-hulkenberg-f1-driver-profile-picture.webp', number: 27, bio: 'Experienced German leading the new Audi factory project in F1.', stats: { wins: 0, podiums: 0, championships: 0, poles: 1 } },
  { id: 'gabriel-bortoleto', name: 'Gabriel Bortoleto', team: 'Audi Formula Racing', country: 'Brazil', image: '/assets/driver/gabriel-bortoleto-f1-driver-profile-picture.webp', number: 5, bio: 'Formula 2 Champion moving up to the big league with Audi.', stats: { wins: 0, podiums: 0, championships: 0, poles: 0 } },
  { id: 'liam-lawson', name: 'Liam Lawson', team: 'Visa Cash App RB F1 Team', country: 'New Zealand', image: '/assets/driver/liam-lawson-f1-driver-profile-picture.webp', number: 30, bio: 'Impressive rookie who showed great adaptability as a stand-in, now a full-time driver.', stats: { wins: 0, podiums: 0, championships: 0, poles: 0 } },
  { id: 'isack-hadjar', name: 'Isack Hadjar', team: 'Oracle Red Bull Racing', country: 'France', image: '/assets/driver/isack-hadjar-f1-driver-profile-picture.webp', number: 21, bio: 'Helmut Marko\'s latest prodigy looking to impress at Red Bull Racing.', stats: { wins: 0, podiums: 0, championships: 0, poles: 0 } },
  { id: 'carlos-sainz', name: 'Carlos Sainz', team: 'Williams Racing', country: 'Spain', image: '/assets/driver/carlos-sainz-f1-driver-profile-picture.webp', number: 55, bio: 'Smooth operator, highly intelligent racer setting off on a new journey with Williams.', stats: { wins: 2, podiums: 18, championships: 0, poles: 5 } },
  { id: 'valtteri-bottas', name: 'Valtteri Bottas', team: 'Cadillac F1 Team', country: 'Finland', image: '/assets/driver/valtteri-bottas-f1-driver-profile-picture.webp', number: 77, bio: 'Experienced 10-time race winner bringing crucial knowledge to the new Cadillac team.', stats: { wins: 10, podiums: 67, championships: 0, poles: 20 } },
  { id: 'oliver-bearman', name: 'Oliver Bearman', team: 'MoneyGram Haas F1 Team', country: 'United Kingdom', image: '/assets/driver/oliver-bearman-f1-driver-profile-picture.webp', number: 87, bio: 'Ferrari junior who impressed heavily in his debut stand-in and earned a full-time seat.', stats: { wins: 0, podiums: 0, championships: 0, poles: 0 } },
  { id: 'arvid-lindblad', name: 'Arvid Lindblad', team: 'Visa Cash App RB F1 Team', country: 'United Kingdom', image: '/assets/driver/arvid-lindblad-f1-driver-profile-picture.webp', number: 8, bio: 'Highly rated Red Bull junior breaking into the sport with Racing Bulls.', stats: { wins: 0, podiums: 0, championships: 0, poles: 0 } },
];

const rawConstructors = [
  { id: 'ferrari', name: 'Scuderia Ferrari', color: '#dc0000', origin: 'Maranello, Italy', engine: 'Ferrari', description: 'The oldest and most successful team in F1 history, synonymous with passion and speed.', carImage: '/assets/car/20260210_094253_6888bb2d.jpg', specs: { topSpeed: 96, downforce: 94, reliability: 89, acceleration: 97 } },
  { id: 'mercedes', name: 'Mercedes-AMG Petronas F1 Team', color: '#00d2be', origin: 'Brackley, UK', engine: 'Mercedes', description: 'Dominant force in the turbo-hybrid era, known for engineering excellence.', carImage: '/assets/car/20260210_094216_bc5f9c6a.jpg', specs: { topSpeed: 93, downforce: 95, reliability: 92, acceleration: 92 } },
  { id: 'red-bull', name: 'Oracle Red Bull Racing', color: '#0600ef', origin: 'Milton Keynes, UK', engine: 'Red Bull Ford', description: 'Four-time consecutive champions setting the aerodynamic benchmark.', carImage: '/assets/car/20260210_094235_9c0bb216.jpg', specs: { topSpeed: 98, downforce: 98, reliability: 94, acceleration: 96 } },
  { id: 'mclaren', name: 'McLaren Formula 1 Team', color: '#ff8700', origin: 'Woking, UK', engine: 'Mercedes', description: 'Historic team that has returned to its winning ways under new leadership.', carImage: '/assets/car/20260210_094141_1ee2e088.jpg', specs: { topSpeed: 97, downforce: 96, reliability: 90, acceleration: 95 } },
  { id: 'aston-martin', name: 'Aston Martin Aramco F1 Team', color: '#006f62', origin: 'Silverstone, UK', engine: 'Honda', description: 'Ambitious team with new state-of-the-art facilities.', carImage: '/assets/car/20260210_094416_13a5d702.jpg', specs: { topSpeed: 94, downforce: 92, reliability: 88, acceleration: 93 } },
  { id: 'alpine', name: 'BWT Alpine F1 Team', color: '#0090ff', origin: 'Enstone, UK', engine: 'Mercedes', description: 'The French factory squad aiming to compete at the very front.', carImage: '/assets/car/20260210_094502_5e5746d7.jpg', specs: { topSpeed: 90, downforce: 90, reliability: 85, acceleration: 90 } },
  { id: 'williams', name: 'Williams Racing', color: '#005aff', origin: 'Grove, UK', engine: 'Mercedes', description: 'A legendary independent team with a rich history of championships, currently rebuilding.', carImage: '/assets/car/20260210_094312_699dc189.jpg', specs: { topSpeed: 95, downforce: 85, reliability: 86, acceleration: 91 } },
  { id: 'racing-bulls', name: 'Visa Cash App RB F1 Team', color: '#1634d3', origin: 'Faenza, Italy', engine: 'Red Bull Ford', description: 'Red Bull\'s sister team focused on developing young talent.', carImage: '/assets/car/20260210_094359_1918323c.jpg', specs: { topSpeed: 92, downforce: 88, reliability: 89, acceleration: 90 } },
  { id: 'audi', name: 'Audi Formula Racing', color: '#000000', origin: 'Hinwil, CH (Sauber)', engine: 'Audi', description: 'German automotive giant finally entering F1 with a full factory commitment.', carImage: '/assets/car/20260210_094448_36162388.jpg', specs: { topSpeed: 89, downforce: 87, reliability: 95, acceleration: 88 } },
  { id: 'cadillac', name: 'Cadillac F1 Team', color: '#ffda00', origin: 'USA/UK', engine: 'Ferrari', description: 'The newest entrant to the grid, bringing true American racing spirit to the global stage.', carImage: '/assets/car/20260210_094517_188a664e.jpg', specs: { topSpeed: 91, downforce: 86, reliability: 82, acceleration: 92 } },
  { id: 'haas', name: 'MoneyGram Haas F1 Team', color: '#ffffff', origin: 'Kannapolis, USA', engine: 'Ferrari', description: 'American outfit punching above its weight through crucial technical partnerships.', carImage: '/assets/car/20260210_094432_cf4bbf18.jpg', specs: { topSpeed: 93, downforce: 84, reliability: 85, acceleration: 89 } }
];

const rawSchedule = [
  {"id":"australia","round":1,"grandPrix":"Australian Grand Prix","circuit":"Albert Park Circuit","date":"Mar 6-8, 2026","mockPodium":["Max Verstappen","Charles Leclerc","Lando Norris"],"dateObj":"2026-03-08T05:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Australia.png","sessions":{"p1":"2026-03-06T02:00:00.000Z","p2":"2026-03-06T05:00:00.000Z","p3":"2026-03-07T02:00:00.000Z","qualifying":"2026-03-07T05:00:00.000Z","race":"2026-03-08T05:00:00Z"}},
  {"id":"china","round":2,"grandPrix":"Chinese Grand Prix","circuit":"Shanghai International Circuit","date":"Mar 13-15, 2026","mockPodium":["Charles Leclerc","Max Verstappen","Lewis Hamilton"],"dateObj":"2026-03-15T07:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244986/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/China.png","sessions":{"p1":"2026-03-13T04:00:00.000Z","p2":"2026-03-13T07:00:00.000Z","p3":"2026-03-14T04:00:00.000Z","qualifying":"2026-03-14T07:00:00.000Z","race":"2026-03-15T07:00:00Z"}},
  {"id":"japan","round":3,"grandPrix":"Japanese Grand Prix","circuit":"Suzuka International Racing Course","date":"Mar 27-29, 2026","mockPodium":["Lando Norris","Oscar Piastri","Max Verstappen"],"dateObj":"2026-03-29T05:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Japan.png","sessions":{"p1":"2026-03-27T02:00:00.000Z","p2":"2026-03-27T05:00:00.000Z","p3":"2026-03-28T02:00:00.000Z","qualifying":"2026-03-28T05:00:00.000Z","race":"2026-03-29T05:00:00Z"}},
  {"id":"bahrain","round":4,"grandPrix":"Bahrain Grand Prix","circuit":"Bahrain International Circuit","date":"Apr 10-12, 2026","mockPodium":["Lewis Hamilton","George Russell","Max Verstappen"],"dateObj":"2026-04-12T15:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Bahrain.png","sessions":{"p1":"2026-04-10T12:00:00.000Z","p2":"2026-04-10T15:00:00.000Z","p3":"2026-04-11T12:00:00.000Z","qualifying":"2026-04-11T15:00:00.000Z","race":"2026-04-12T15:00:00Z"}},
  {"id":"saudi","round":5,"grandPrix":"Saudi Arabian Grand Prix","circuit":"Jeddah Corniche Circuit","date":"Apr 17-19, 2026","mockPodium":["Max Verstappen","Sergio Perez","Fernando Alonso"],"dateObj":"2026-04-19T17:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Saudi%20Arabia.png","sessions":{"p1":"2026-04-17T14:00:00.000Z","p2":"2026-04-17T17:00:00.000Z","p3":"2026-04-18T14:00:00.000Z","qualifying":"2026-04-18T17:00:00.000Z","race":"2026-04-19T17:00:00Z"}},
  {"id":"miami","round":6,"grandPrix":"Miami Grand Prix","circuit":"Miami International Autodrome","date":"May 1-3, 2026","mockPodium":["Lando Norris","Charles Leclerc","Max Verstappen"],"dateObj":"2026-05-03T20:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Miami.png","sessions":{"p1":"2026-05-01T17:00:00.000Z","p2":"2026-05-01T20:00:00.000Z","p3":"2026-05-02T17:00:00.000Z","qualifying":"2026-05-02T20:00:00.000Z","race":"2026-05-03T20:00:00Z"}},
  {"id":"canada","round":7,"grandPrix":"Canadian Grand Prix","circuit":"Circuit Gilles-Villeneuve","date":"May 22-24, 2026","mockPodium":["Oscar Piastri","George Russell","Lewis Hamilton"],"dateObj":"2026-05-24T18:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Canada.png","sessions":{"p1":"2026-05-22T15:00:00.000Z","p2":"2026-05-22T18:00:00.000Z","p3":"2026-05-23T15:00:00.000Z","qualifying":"2026-05-23T18:00:00.000Z","race":"2026-05-24T18:00:00Z"}},
  {"id":"monaco","round":8,"grandPrix":"Monaco Grand Prix","circuit":"Circuit de Monaco","date":"Jun 5-7, 2026","mockPodium":["Charles Leclerc","Oscar Piastri","Carlos Sainz"],"dateObj":"2026-06-07T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Monaco.png","sessions":{"p1":"2026-06-05T10:00:00.000Z","p2":"2026-06-05T13:00:00.000Z","p3":"2026-06-06T10:00:00.000Z","qualifying":"2026-06-06T13:00:00.000Z","race":"2026-06-07T13:00:00Z"}},
  {"id":"spain-barcelona","round":9,"grandPrix":"Spanish Grand Prix","circuit":"Circuit de Barcelona-Catalunya","date":"Jun 12-14, 2026","mockPodium":["Max Verstappen","Lando Norris","Lewis Hamilton"],"dateObj":"2026-06-14T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Spain.png","sessions":{"p1":"2026-06-12T10:00:00.000Z","p2":"2026-06-12T13:00:00.000Z","p3":"2026-06-13T10:00:00.000Z","qualifying":"2026-06-13T13:00:00.000Z","race":"2026-06-14T13:00:00Z"}},
  {"id":"austria","round":10,"grandPrix":"Austrian Grand Prix","circuit":"Red Bull Ring","date":"Jun 26-28, 2026","mockPodium":["George Russell","Oscar Piastri","Carlos Sainz"],"dateObj":"2026-06-28T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria.png","sessions":{"p1":"2026-06-26T10:00:00.000Z","p2":"2026-06-26T13:00:00.000Z","p3":"2026-06-27T10:00:00.000Z","qualifying":"2026-06-27T13:00:00.000Z","race":"2026-06-28T13:00:00Z"}},
  {"id":"great-britain","round":11,"grandPrix":"British Grand Prix","circuit":"Silverstone Circuit","date":"Jul 3-5, 2026","mockPodium":["Max Verstappen","Driver 2","Driver 3"],"dateObj":"2026-07-05T14:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Great%20Britain.png","sessions":{"p1":"2026-07-03T11:00:00.000Z","p2":"2026-07-03T14:00:00.000Z","p3":"2026-07-04T11:00:00.000Z","qualifying":"2026-07-04T14:00:00.000Z","race":"2026-07-05T14:00:00Z"}},
  {"id":"belgium","round":12,"grandPrix":"Belgian Grand Prix","circuit":"Circuit de Spa-Francorchamps","date":"Jul 17-19, 2026","mockPodium":null,"dateObj":"2026-07-19T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Belgium.png","sessions":{"p1":"2026-07-17T10:00:00.000Z","p2":"2026-07-17T13:00:00.000Z","p3":"2026-07-18T10:00:00.000Z","qualifying":"2026-07-18T13:00:00.000Z","race":"2026-07-19T13:00:00Z"}},
  {"id":"hungary","round":13,"grandPrix":"Hungarian Grand Prix","circuit":"Hungaroring","date":"Jul 24-26, 2026","mockPodium":null,"dateObj":"2026-07-26T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Hungary.png","sessions":{"p1":"2026-07-24T10:00:00.000Z","p2":"2026-07-24T13:00:00.000Z","p3":"2026-07-25T10:00:00.000Z","qualifying":"2026-07-25T13:00:00.000Z","race":"2026-07-26T13:00:00Z"}},
  {"id":"netherlands","round":14,"grandPrix":"Dutch Grand Prix","circuit":"Circuit Zandvoort","date":"Aug 21-23, 2026","mockPodium":null,"dateObj":"2026-08-23T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Netherlands.png","sessions":{"p1":"2026-08-21T10:00:00.000Z","p2":"2026-08-21T13:00:00.000Z","p3":"2026-08-22T10:00:00.000Z","qualifying":"2026-08-22T13:00:00.000Z","race":"2026-08-23T13:00:00Z"}},
  {"id":"italy","round":15,"grandPrix":"Italian Grand Prix","circuit":"Monza Circuit","date":"Sep 4-6, 2026","mockPodium":null,"dateObj":"2026-09-06T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Italy.png","sessions":{"p1":"2026-09-04T10:00:00.000Z","p2":"2026-09-04T13:00:00.000Z","p3":"2026-09-05T10:00:00.000Z","qualifying":"2026-09-05T13:00:00.000Z","race":"2026-09-06T13:00:00Z"}},
  {"id":"madrid","round":16,"grandPrix":"Spanish Grand Prix (Madrid)","circuit":"Madrid Street Circuit","date":"Sep 11-13, 2026","mockPodium":null,"dateObj":"2026-09-13T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Spain.png","sessions":{"p1":"2026-09-11T10:00:00.000Z","p2":"2026-09-11T13:00:00.000Z","p3":"2026-09-12T10:00:00.000Z","qualifying":"2026-09-12T13:00:00.000Z","race":"2026-09-13T13:00:00Z"}},
  {"id":"azerbaijan","round":17,"grandPrix":"Azerbaijan Grand Prix","circuit":"Baku City Circuit","date":"Sep 25-27, 2026","mockPodium":null,"dateObj":"2026-09-27T11:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Azerbaijan.png","sessions":{"p1":"2026-09-25T08:00:00.000Z","p2":"2026-09-25T11:00:00.000Z","p3":"2026-09-26T08:00:00.000Z","qualifying":"2026-09-26T11:00:00.000Z","race":"2026-09-27T11:00:00Z"}},
  {"id":"singapore","round":18,"grandPrix":"Singapore Grand Prix","circuit":"Marina Bay Street Circuit","date":"Oct 9-11, 2026","mockPodium":null,"dateObj":"2026-10-11T12:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Singapore.png","sessions":{"p1":"2026-10-09T09:00:00.000Z","p2":"2026-10-09T12:00:00.000Z","p3":"2026-10-10T09:00:00.000Z","qualifying":"2026-10-10T12:00:00.000Z","race":"2026-10-11T12:00:00Z"}},
  {"id":"usa","round":19,"grandPrix":"United States Grand Prix","circuit":"Circuit of the Americas","date":"Oct 23-25, 2026","mockPodium":null,"dateObj":"2026-10-25T19:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/United%20States.png","sessions":{"p1":"2026-10-23T16:00:00.000Z","p2":"2026-10-23T19:00:00.000Z","p3":"2026-10-24T16:00:00.000Z","qualifying":"2026-10-24T19:00:00.000Z","race":"2026-10-25T19:00:00Z"}},
  {"id":"mexico","round":20,"grandPrix":"Mexico City Grand Prix","circuit":"Autódromo Hermanos Rodríguez","date":"Oct 30 - Nov 1, 2026","mockPodium":null,"dateObj":"2026-11-01T20:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Mexico.png","sessions":{"p1":"2026-10-30T17:00:00.000Z","p2":"2026-10-30T20:00:00.000Z","p3":"2026-10-31T17:00:00.000Z","qualifying":"2026-10-31T20:00:00.000Z","race":"2026-11-01T20:00:00Z"}},
  {"id":"brazil","round":21,"grandPrix":"São Paulo Grand Prix","circuit":"Autódromo José Carlos Pace (Interlagos)","date":"Nov 6-8, 2026","mockPodium":null,"dateObj":"2026-11-08T17:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Brazil.png","sessions":{"p1":"2026-11-06T14:00:00.000Z","p2":"2026-11-06T17:00:00.000Z","p3":"2026-11-07T14:00:00.000Z","qualifying":"2026-11-07T17:00:00.000Z","race":"2026-11-08T17:00:00Z"}},
  {"id":"las-vegas","round":22,"grandPrix":"Las Vegas Grand Prix","circuit":"Las Vegas Strip Circuit","date":"Nov 19-21, 2026","mockPodium":null,"dateObj":"2026-11-21T06:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Las%20Vegas.png","sessions":{"p1":"2026-11-19T03:00:00.000Z","p2":"2026-11-19T06:00:00.000Z","p3":"2026-11-20T03:00:00.000Z","qualifying":"2026-11-20T06:00:00.000Z","race":"2026-11-21T06:00:00Z"}},
  {"id":"qatar","round":23,"grandPrix":"Qatar Grand Prix","circuit":"Lusail International Circuit","date":"Nov 27-29, 2026","mockPodium":null,"dateObj":"2026-11-29T17:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Qatar.png","sessions":{"p1":"2026-11-27T14:00:00.000Z","p2":"2026-11-27T17:00:00.000Z","p3":"2026-11-28T14:00:00.000Z","qualifying":"2026-11-28T17:00:00.000Z","race":"2026-11-29T17:00:00Z"}},
  {"id":"abu-dhabi","round":24,"grandPrix":"Abu Dhabi Grand Prix","circuit":"Yas Marina Circuit","date":"Dec 4-6, 2026","mockPodium":null,"dateObj":"2026-12-06T13:00:00Z","image":"https://media.formula1.com/image/upload/f_auto/q_auto/v1677244984/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Abu%20Dhabi.png","sessions":{"p1":"2026-12-04T10:00:00.000Z","p2":"2026-12-04T13:00:00.000Z","p3":"2026-12-05T10:00:00.000Z","qualifying":"2026-12-05T13:00:00.000Z","race":"2026-12-06T13:00:00Z"}}
];

const currentDate = new Date();

export const schedule = rawSchedule.map(race => {
  const isPast = new Date(race.dateObj) < currentDate;
  return {
    ...race,
    status: isPast ? 'finished' : 'upcoming',
    podium: isPast ? race.mockPodium : null,
    winner: (isPast && race.mockPodium) ? race.mockPodium[0] : null // Maintain winner property for backwards compatibility
  };
});

// Dynamically compute points for simulated 2026 season
const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
let driverPointsMap = {};
rawDrivers.forEach(d => driverPointsMap[d.name] = 0);

// Hardcode exact points to match user screenshot for 2026 season (Base points up to Round 10)
const base2026Points = {
  'Kimi Antonelli': 179,
  'George Russell': 136,
  'Lewis Hamilton': 132,
  'Lando Norris': 85,
  'Charles Leclerc': 83,
  'Oscar Piastri': 82,
  'Max Verstappen': 75,
  'Carlos Sainz': 45,
  'Fernando Alonso': 32,
  'Sergio Perez': 25,
  'Alex Albon': 18,
  'Pierre Gasly': 12,
  'Esteban Ocon': 10,
  'Nico Hulkenberg': 6,
  'Lance Stroll': 4,
  'Valtteri Bottas': 2,
};

rawDrivers.forEach(d => {
  if (base2026Points[d.name] !== undefined) {
    driverPointsMap[d.name] = base2026Points[d.name];
  }
});

// Automatically update points for any races from Round 11 onwards!
schedule.forEach(race => {
  // Only add points for races after Austria (Round 10) since base points cover Rounds 1-10
  if (race.round > 10 && race.status === 'finished' && race.podium) {
    race.podium.forEach((driverId, index) => {
      const driver = rawDrivers.find(d => d.id === driverId);
      if (driver && index < pointsSystem.length) {
        driverPointsMap[driver.name] += pointsSystem[index];
      }
    });
  }
});

// Export drivers with dynamic points and rank them
export const drivers = rawDrivers.map(d => ({
  ...d,
  points: driverPointsMap[d.name]
})).sort((a, b) => b.points - a.points).map((d, index) => ({
  ...d,
  position: index + 1
}));

// Export constructors with dynamic points aggregated from drivers
export const constructors = rawConstructors.map(c => {
  const teamDrivers = drivers.filter(d => d.team === c.name);
  const teamPoints = teamDrivers.reduce((sum, d) => sum + d.points, 0);
  return {
    ...c,
    points: teamPoints
  };
}).sort((a, b) => b.points - a.points).map((c, index) => ({
  ...c,
  position: index + 1
}));
