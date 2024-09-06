import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryNotesRepository } from '@/repositories/in-memory/in-memory-notes-repository';
import { GetNoteWithGradesUseCase } from './get-notes-with-grades';

let notesRepository: InMemoryNotesRepository;
let getNoteWithGradesUseCase: GetNoteWithGradesUseCase;

describe('Get Note With Grades Use Case', () => {
  beforeEach(() => {
    notesRepository = new InMemoryNotesRepository();
    getNoteWithGradesUseCase = new GetNoteWithGradesUseCase(notesRepository);
  });

  it('should return the note with calculated grades for 10th class', async () => {
    const tt = await notesRepository.addNote({
      p1: 10,
      p2: 15,
      resource: 12,
      mester: 'FIRST',
      level: 'CLASS_10',
      studentId: 123,
      subjectId: 456,
    });
    console.table(tt)

    const { note } = await getNoteWithGradesUseCase.execute({
      studentId: 123,
      classLevel: 'CLASS_13',
    });
    console.table(note)
    expect(note).toBeTruthy();
    expect(note.mt1).toBe((10 + 15 + 12) / 3); // Exemplo de cálculo
  });
});
