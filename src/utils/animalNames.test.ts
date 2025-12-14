import { generateAnimalName } from './animalNames';

describe('generateAnimalName', () => {
  test('generates a consistent name for the same user ID', () => {
    const userId = 'test-user-123';
    const name1 = generateAnimalName(userId);
    const name2 = generateAnimalName(userId);
    
    expect(name1).toBe(name2);
  });

  test('generates different names for different user IDs', () => {
    const userId1 = 'user-123';
    const userId2 = 'user-456';
    
    const name1 = generateAnimalName(userId1);
    const name2 = generateAnimalName(userId2);
    
    expect(name1).not.toBe(name2);
  });

  test('generates a name with adjective and animal', () => {
    const userId = 'test-user';
    const name = generateAnimalName(userId);
    
    // Should have format "Adjective Animal"
    expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
  });

  test('generates valid animal names', () => {
    const userIds = ['user1', 'user2', 'user3', 'user4', 'user5'];
    
    userIds.forEach(userId => {
      const name = generateAnimalName(userId);
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });
});
