import { Species } from '../types';

export const SPECIES_DB: Species[] = [
  {
    id: 'monstera-deliciosa',
    commonName: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800',
    description: 'Famous for its natural leaf holes, this tropical beauty is a favorite for its dramatic foliage and easy-going nature.',
    care: {
      water: 'Water every 1-2 weeks, allowing soil to dry out between waterings.',
      light: 'Bright to medium indirect light. Avoid direct sun.',
      temperature: '65°F - 85°F (18°C - 30°C)',
      humidity: 'Normal to high humidity preferred.'
    },
    commonIssues: ['Yellowing leaves (overwatering)', 'Brown tips (low humidity)', 'Leggy growth (low light)'],
    suggestedWaterFrequency: 10,
    suggestedMistFrequency: 3,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'snake-plant',
    commonName: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    imageUrl: 'https://images.unsplash.com/photo-1593482886875-6647f38fa83f?auto=format&fit=crop&q=80&w=800',
    description: 'An architectural plant with upright leaves. Extremely hardy and excellent at purifying air.',
    care: {
      water: 'Water every 2-3 weeks. Allow soil to dry completely.',
      light: 'Low to bright indirect light. Can tolerate some direct sun.',
      temperature: '55°F - 85°F (13°C - 30°C)',
      humidity: 'Low to normal humidity.'
    },
    commonIssues: ['Root rot (overwatering)', 'Mushy leaves (cold damage)'],
    suggestedWaterFrequency: 21,
    suggestedMistFrequency: 0,
    suggestedFertilizeFrequency: 60
  },
  {
    id: 'fiddle-leaf-fig',
    commonName: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    imageUrl: 'https://images.unsplash.com/photo-1597055181300-e30ba1546d26?auto=format&fit=crop&q=80&w=800',
    description: 'Known for its large, violin-shaped leaves. It can be finicky but makes a stunning statement piece.',
    care: {
      water: 'Water once a week. Keep soil consistently moist but not soaking.',
      light: 'Bright, filtered light. Rotating the plant helps even growth.',
      temperature: '60°F - 75°F (15°C - 24°C)',
      humidity: 'High humidity is essential.'
    },
    commonIssues: ['Dropping leaves (drafts/dryness)', 'Brown spots (root rot)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 2,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'pothos',
    commonName: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    imageUrl: 'https://images.unsplash.com/photo-1596722889246-81765c71d24c?auto=format&fit=crop&q=80&w=800',
    description: 'The ultimate beginner plant. Fast-growing trailing vines that tolerate neglect and low light.',
    care: {
      water: 'Water every 1-2 weeks. Tolerates erratic watering.',
      light: 'Low to bright indirect light.',
      temperature: '60°F - 85°F (15°C - 30°C)',
      humidity: 'Any humidity level.'
    },
    commonIssues: ['Yellow leaves (overwatering)', 'Loss of variegation (low light)'],
    suggestedWaterFrequency: 10,
    suggestedMistFrequency: 7,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'zz-plant',
    commonName: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    imageUrl: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800',
    description: 'With waxy, shiny leaves, the ZZ plant is drought tolerant and thrives in low light conditions.',
    care: {
      water: 'Water every 2-3 weeks. Allow soil to dry out.',
      light: 'Low to bright indirect light.',
      temperature: '60°F - 75°F (15°C - 24°C)',
      humidity: 'Low to average humidity.'
    },
    commonIssues: ['Yellowing lower leaves (overwatering)', 'Wrinkled stems (severe underwatering)'],
    suggestedWaterFrequency: 21,
    suggestedMistFrequency: 0,
    suggestedFertilizeFrequency: 90
  },
  {
    id: 'peace-lily',
    commonName: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55ce32e0112?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant white flowers and dark green leaves. It dramatically droops when thirsty, acting as its own sensor.',
    care: {
      water: 'Keep soil moist. Water weekly or when leaves droop.',
      light: 'Low to medium indirect light.',
      temperature: '65°F - 80°F (18°C - 26°C)',
      humidity: 'High humidity preferred.'
    },
    commonIssues: ['Brown tips (tap water chemicals)', 'Green flowers (low light)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 2,
    suggestedFertilizeFrequency: 45
  },
  {
    id: 'spider-plant',
    commonName: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    imageUrl: 'https://images.unsplash.com/photo-1572688484279-a27d0354ea47?auto=format&fit=crop&q=80&w=800',
    description: 'Produces "babies" or spiderettes that dangle from the mother plant. Very easy to propagate.',
    care: {
      water: 'Water weekly. Keep soil evenly moist.',
      light: 'Bright, indirect light.',
      temperature: '55°F - 80°F (13°C - 27°C)',
      humidity: 'Average humidity.'
    },
    commonIssues: ['Brown tips (fluoride in water)', 'Fading stripes (low light)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 3,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'aloe-vera',
    commonName: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    imageUrl: 'https://images.unsplash.com/photo-1554631221-f9603e6808be?auto=format&fit=crop&q=80&w=800',
    description: 'A succulent known for its healing gel. Requires very little water and loves the sun.',
    care: {
      water: 'Water deeply every 3 weeks. Soil must dry completely.',
      light: 'Bright, direct sunlight.',
      temperature: '55°F - 80°F (13°C - 27°C)',
      humidity: 'Low humidity.'
    },
    commonIssues: ['Mushy stems (rot)', 'Flat leaves (insufficient light)'],
    suggestedWaterFrequency: 21,
    suggestedMistFrequency: 0,
    suggestedFertilizeFrequency: 60
  },
  {
    id: 'rubber-plant',
    commonName: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e026eff3?auto=format&fit=crop&q=80&w=800',
    description: 'Has thick, glossy, rubbery leaves. Can grow into a large indoor tree.',
    care: {
      water: 'Water every 1-2 weeks. Keep soil moist in summer.',
      light: 'Bright, indirect light.',
      temperature: '60°F - 75°F (15°C - 24°C)',
      humidity: 'Normal to high humidity.'
    },
    commonIssues: ['Dropping lower leaves (low light)', 'Dusty leaves (needs wiping)'],
    suggestedWaterFrequency: 10,
    suggestedMistFrequency: 3,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'bird-of-paradise',
    commonName: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    imageUrl: 'https://images.unsplash.com/photo-1550505417-0c0e7b4742a1?auto=format&fit=crop&q=80&w=800',
    description: 'Known for its large, banana-like leaves and exotic flowers resembling birds. Needs plenty of space and light.',
    care: {
      water: 'Water every 1-2 weeks. Keep soil moist but not soggy.',
      light: 'Bright, direct to indirect light.',
      temperature: '65°F - 85°F (18°C - 30°C)',
      humidity: 'High humidity preferred.'
    },
    commonIssues: ['Splitting leaves (natural)', 'Curling leaves (underwatering)'],
    suggestedWaterFrequency: 10,
    suggestedMistFrequency: 3,
    suggestedFertilizeFrequency: 14
  },
  {
    id: 'pilea-peperomioides',
    commonName: 'Chinese Money Plant',
    scientificName: 'Pilea peperomioides',
    imageUrl: 'https://images.unsplash.com/photo-1628639692461-82782e4f0c4d?auto=format&fit=crop&q=80&w=800',
    description: 'Famous for its coin-shaped leaves. Fast grower that produces many "pups" you can share with friends.',
    care: {
      water: 'Water weekly. Allow soil to dry out slightly.',
      light: 'Bright, indirect light. Rotate frequently.',
      temperature: '60°F - 75°F (15°C - 24°C)',
      humidity: 'Average humidity.'
    },
    commonIssues: ['Curling leaves (heat stress)', 'Drooping stems (needs water)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 0,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'calathea-orbifolia',
    commonName: 'Calathea Orbifolia',
    scientificName: 'Goeppertia orbifolia',
    imageUrl: 'https://images.unsplash.com/photo-1629813580436-1e5b53051412?auto=format&fit=crop&q=80&w=800',
    description: 'Stunning oversized leaves with silver stripes. Known as a "prayer plant" as leaves fold up at night.',
    care: {
      water: 'Water every 1-2 weeks. Keep consistently moist with distilled water.',
      light: 'Medium to low indirect light.',
      temperature: '65°F - 80°F (18°C - 27°C)',
      humidity: 'Very high humidity required.'
    },
    commonIssues: ['Brown edges (low humidity/tap water)', 'Fading pattern (too much light)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 1,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'jade-plant',
    commonName: 'Jade Plant',
    scientificName: 'Crassula ovata',
    imageUrl: 'https://images.unsplash.com/photo-1596516398863-125039a0669b?auto=format&fit=crop&q=80&w=800',
    description: 'A popular succulent symbolizing good luck. Forms a miniature tree structure with thick, woody stems.',
    care: {
      water: 'Water every 2-3 weeks. Allow soil to dry completely.',
      light: 'Bright, direct sunlight for at least 4 hours.',
      temperature: '65°F - 75°F (18°C - 24°C)',
      humidity: 'Low humidity.'
    },
    commonIssues: ['Dropping leaves (low light)', 'Mushy stems (overwatering)'],
    suggestedWaterFrequency: 21,
    suggestedMistFrequency: 0,
    suggestedFertilizeFrequency: 90
  },
  {
    id: 'string-of-pearls',
    commonName: 'String of Pearls',
    scientificName: 'Senecio rowleyanus',
    imageUrl: 'https://images.unsplash.com/photo-1616616212579-24b42398555c?auto=format&fit=crop&q=80&w=800',
    description: 'A cascading succulent with pea-shaped leaves. Perfect for hanging baskets in bright spots.',
    care: {
      water: 'Water every 2-3 weeks. Sensitive to overwatering.',
      light: 'Bright, indirect light to some direct sun.',
      temperature: '70°F - 80°F (21°C - 27°C)',
      humidity: 'Low humidity.'
    },
    commonIssues: ['Shriveling pearls (underwatering)', 'Mushy pearls (overwatering)'],
    suggestedWaterFrequency: 14,
    suggestedMistFrequency: 0,
    suggestedFertilizeFrequency: 60
  },
  {
    id: 'boston-fern',
    commonName: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    imageUrl: 'https://images.unsplash.com/photo-1598509831416-2c701412351d?auto=format&fit=crop&q=80&w=800',
    description: 'Classic fern with arching fronds. Acts as a natural humidifier but craves moisture.',
    care: {
      water: 'Water twice a week. Keep soil consistently damp.',
      light: 'Bright, indirect light to partial shade.',
      temperature: '60°F - 75°F (15°C - 24°C)',
      humidity: 'High humidity is crucial.'
    },
    commonIssues: ['Brown crisping fronds (low humidity)', 'Pale leaves (needs fertilizer)'],
    suggestedWaterFrequency: 4,
    suggestedMistFrequency: 1,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'english-ivy',
    commonName: 'English Ivy',
    scientificName: 'Hedera helix',
    imageUrl: 'https://images.unsplash.com/photo-1620023023075-846312542478?auto=format&fit=crop&q=80&w=800',
    description: 'A vigorous climber with evergreen leaves. Can be trained to climb supports or trail from baskets.',
    care: {
      water: 'Water weekly. Let top inch of soil dry out.',
      light: 'Medium to bright light.',
      temperature: '50°F - 70°F (10°C - 21°C)',
      humidity: 'Medium humidity.'
    },
    commonIssues: ['Spider mites (dry air)', 'Slow growth (low light)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 3,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'african-violet',
    commonName: 'African Violet',
    scientificName: 'Saintpaulia',
    imageUrl: 'https://images.unsplash.com/photo-1577909033324-44b4da79057b?auto=format&fit=crop&q=80&w=800',
    description: 'Compact flowering plant that blooms year-round with fuzzy leaves. Bottom watering is best.',
    care: {
      water: 'Water weekly from bottom. Keep soil moist.',
      light: 'Bright, indirect light.',
      temperature: '65°F - 80°F (18°C - 27°C)',
      humidity: 'Moderate humidity.'
    },
    commonIssues: ['Spots on leaves (cold water)', 'No flowers (low light)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 0,
    suggestedFertilizeFrequency: 14
  },
  {
    id: 'alocasia-polly',
    commonName: 'Alocasia Polly',
    scientificName: 'Alocasia amazonica',
    imageUrl: 'https://images.unsplash.com/photo-1600854291845-d4420371307b?auto=format&fit=crop&q=80&w=800',
    description: 'Striking arrow-shaped leaves with bold white veins. A statement plant that loves warmth.',
    care: {
      water: 'Water weekly. Keep soil moist but allow top to dry slightly.',
      light: 'Bright, indirect light.',
      temperature: '65°F - 80°F (18°C - 27°C)',
      humidity: 'High humidity.'
    },
    commonIssues: ['Dropping leaves (cold/dry)', 'Spider mites (dry air)'],
    suggestedWaterFrequency: 7,
    suggestedMistFrequency: 2,
    suggestedFertilizeFrequency: 14
  },
  {
    id: 'bamboo-palm',
    commonName: 'Bamboo Palm',
    scientificName: 'Chamaedorea seifrizii',
    imageUrl: 'https://images.unsplash.com/photo-1615591322049-556947230d40?auto=format&fit=crop&q=80&w=800',
    description: 'Adds a tropical touch with feathery fronds. excellent air purifier and pet-safe.',
    care: {
      water: 'Water when top third of soil is dry.',
      light: 'Bright, indirect to low light.',
      temperature: '65°F - 80°F (18°C - 27°C)',
      humidity: 'Moderate to high.'
    },
    commonIssues: ['Brown tips (fluoride/dryness)', 'Yellow fronds (overwatering)'],
    suggestedWaterFrequency: 10,
    suggestedMistFrequency: 3,
    suggestedFertilizeFrequency: 30
  },
  {
    id: 'majesty-palm',
    commonName: 'Majesty Palm',
    scientificName: 'Ravenea rivularis',
    imageUrl: 'https://images.unsplash.com/photo-1596722889246-81765c71d24c?auto=format&fit=crop&q=80&w=800', // Pothos backup or similar green foliage
    description: 'A large, elegant palm with long, arching green fronds. Thrives near water in nature.',
    care: {
      water: 'Water frequently. Never let soil dry out completely.',
      light: 'Bright, indirect light.',
      temperature: '65°F - 80°F (18°C - 27°C)',
      humidity: 'High humidity is a must.'
    },
    commonIssues: ['Spider mites (dry air)', 'Brown fronds (underwatering)'],
    suggestedWaterFrequency: 5,
    suggestedMistFrequency: 1,
    suggestedFertilizeFrequency: 30
  }
];