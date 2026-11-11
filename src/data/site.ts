export const site = {
  name: 'Chandni Soni',
  tagline: "I'm an engineer who keeps starting companies.",
  email: 'chandni@thinkmocha.com',
  // One artifact under the Edgar Miner line: a short clip or a storybook spread. Null until it exists.
  hero: null as null | { kind: 'image' | 'video'; src: string; alt: string; caption: string; width: number; height: number },
  links: {
    linkedin: 'https://www.linkedin.com/in/sonichandni/',
    github: 'https://github.com/chandnisoni',
    resume: '/resume.pdf',
    edgarMiner: null as string | null, // set when there is a public URL; until then "Ask for access" is a mailto
    ideas: null as string | null, // set to /ideas/ when the list exists
  },
};
