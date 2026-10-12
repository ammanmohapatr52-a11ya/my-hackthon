import { db, type Flashcard } from './db';
import { calculateNextReview, type Rating } from '../srs/scheduler';
import { recordReviewedFlashcard } from './activityStore';
import { ARCHIVE_GK_CARDS } from './gkDeck';

export async function getAllFlashcards(): Promise<Flashcard[]> {
  const cards = await db.flashcards.toArray();
  if (cards.length === 0) {
    // Seed initial academic flashcards
    await seedDefaultCards();
    return await db.flashcards.toArray();
  }
  return cards;
}

export async function getDueFlashcards(): Promise<Flashcard[]> {
  const all = await getAllFlashcards();
  const now = Date.now();
  return all.filter((c) => c.dueAt <= now);
}

export async function addFlashcard(
  card: Pick<Flashcard, 'front' | 'back' | 'mathLatex' | 'category' | 'image'>
): Promise<number> {
  const now = Date.now();
  return await db.flashcards.add({
    ...card,
    ease: 2.5,
    interval: 0,
    reps: 0,
    dueAt: now, // immediately due for initial review
    createdAt: now,
  });
}

export async function updateFlashcard(id: number, changes: Partial<Flashcard>): Promise<void> {
  await db.flashcards.update(id, changes);
}

export async function deleteFlashcard(id: number): Promise<void> {
  await db.flashcards.delete(id);
}

export async function reviewFlashcard(card: Flashcard, rating: Rating): Promise<Flashcard> {
  if (!card.id) throw new Error('Card missing ID');

  const nextState = calculateNextReview(
    {
      ease: card.ease,
      interval: card.interval,
      reps: card.reps,
      dueAt: card.dueAt,
    },
    rating
  );

  const updated: Flashcard = {
    ...card,
    ...nextState,
  };

  await db.flashcards.put(updated);
  await recordReviewedFlashcard();
  return updated;
}

async function seedDefaultCards() {
  const now = Date.now();
  const defaults: Omit<Flashcard, 'id'>[] = [
    {
      front: 'What is the quadratic formula used to solve ax² + bx + c = 0?',
      back: 'x = (-b ± √(b² - 4ac)) / (2a)',
      mathLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      category: 'Algebra',
      ease: 2.5,
      interval: 0,
      reps: 0,
      dueAt: now,
      createdAt: now,
    },
    {
      front: 'What is the derivative of xⁿ with respect to x (Power Rule)?',
      back: 'd/dx (xⁿ) = n · xⁿ⁻¹',
      mathLatex: '\\frac{d}{dx}(x^n) = n x^{n-1}',
      category: 'Calculus',
      ease: 2.5,
      interval: 0,
      reps: 0,
      dueAt: now,
      createdAt: now,
    },
    {
      front: 'What is the Pythagorean Theorem for a right-angled triangle?',
      back: 'a² + b² = c², where c is the hypotenuse.',
      mathLatex: 'a^2 + b^2 = c^2',
      category: 'Geometry',
      ease: 2.5,
      interval: 0,
      reps: 0,
      dueAt: now,
      createdAt: now,
    },
  ];

  await db.flashcards.bulkAdd(defaults);
}

export async function importGKDeck(): Promise<number> {
  const existing = await db.flashcards.toArray();
  const existingFronts = new Set(existing.map((c) => c.front.trim().toLowerCase()));

  const now = Date.now();
  const toAdd: Omit<Flashcard, 'id'>[] = [];

  for (const item of ARCHIVE_GK_CARDS) {
    if (!existingFronts.has(item.front.trim().toLowerCase())) {
      toAdd.push({
        front: item.front,
        back: item.back,
        category: item.category,
        image: item.image,
        ease: 2.5,
        interval: 0,
        reps: 0,
        dueAt: now,
        createdAt: now,
      });
      existingFronts.add(item.front.trim().toLowerCase());
    }
  }

  if (toAdd.length > 0) {
    await db.flashcards.bulkAdd(toAdd);
  }
  return toAdd.length;
}

