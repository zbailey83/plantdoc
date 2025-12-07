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
    commonIssues: ['Yellowing leaves (overwatering)', 'Brown tips (low humidity)', 'Leggy growth (low light)']
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
    commonIssues: ['Root rot (overwatering)', 'Mushy leaves (cold damage)']
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
    commonIssues: ['Dropping leaves (drafts/dryness)', 'Brown spots (root rot)']
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
    commonIssues: ['Yellow leaves (overwatering)', 'Loss of variegation (low light)']
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
    commonIssues: ['Yellowing lower leaves (overwatering)', 'Wrinkled stems (severe underwatering)']
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
    commonIssues: ['Brown tips (tap water chemicals)', 'Green flowers (low light)']
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
    commonIssues: ['Brown tips (fluoride in water)', 'Fading stripes (low light)']
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
    commonIssues: ['Mushy stems (rot)', 'Flat leaves (insufficient light)']
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
    commonIssues: ['Dropping lower leaves (low light)', 'Dusty leaves (needs wiping)']
  }
];