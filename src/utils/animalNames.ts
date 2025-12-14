// Generate a funny animal name from a user ID
export const generateAnimalName = (userId: string): string => {
  const adjectives = [
    'Speedy', 'Jumpy', 'Sleepy', 'Happy', 'Grumpy', 'Silly', 'Crazy', 'Lazy',
    'Dizzy', 'Bouncy', 'Fluffy', 'Sneaky', 'Clumsy', 'Mighty', 'Tiny', 'Giant',
    'Swift', 'Brave', 'Wild', 'Cool', 'Funky', 'Wacky', 'Zany', 'Peppy',
    'Chirpy', 'Perky', 'Snappy', 'Zippy', 'Quirky', 'Jolly'
  ];

  const animals = [
    'Panda', 'Koala', 'Penguin', 'Otter', 'Platypus', 'Capybara', 'Sloth', 'Llama',
    'Raccoon', 'Hedgehog', 'Narwhal', 'Axolotl', 'Quokka', 'Lemur', 'Meerkat', 'Wombat',
    'Chinchilla', 'Manatee', 'Flamingo', 'Toucan', 'Puffin', 'Walrus', 'Beluga', 'Dolphin',
    'Octopus', 'Jellyfish', 'Starfish', 'Seahorse', 'Hamster', 'Ferret', 'Rabbit', 'Fox',
    'Wolf', 'Bear', 'Tiger', 'Lion', 'Giraffe', 'Elephant', 'Zebra', 'Kangaroo'
  ];

  // Use a simple hash function to deterministically pick adjective and animal
  const hash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const userHash = hash(userId);
  const adjectiveIndex = userHash % adjectives.length;
  const animalIndex = Math.floor(userHash / adjectives.length) % animals.length;

  return `${adjectives[adjectiveIndex]} ${animals[animalIndex]}`;
};
