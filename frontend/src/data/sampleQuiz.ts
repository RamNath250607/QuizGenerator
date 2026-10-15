import type { QuizData } from '../types/quiz';


export const SAMPLE_QUIZ: QuizData = {
  title: 'Database Management Systems & SQL Fundamentals',
  topicOrDocument: 'DBMS Normalization & ACID Properties',
  totalQuestions: 5,
  questions: [
    {
      id: 'q1',
      questionText: 'Which normal form eliminates partial dependency by ensuring all non-key attributes are fully functionally dependent on the primary key?',
      type: 'mcq',
      options: [
        'First Normal Form (1NF)',
        'Second Normal Form (2NF)',
        'Third Normal Form (3NF)',
        'Boyce-Codd Normal Form (BCNF)',
      ],
      correctAnswerIndex: 1, // 2NF
      explanation: 'Second Normal Form (2NF) requires the relation to be in 1NF and that no non-prime attribute depends on a proper subset of any candidate key (no partial functional dependency).',
      sourceReference: 'Database System Concepts (Silberschatz), Chapter 7: Relational Database Design',
      difficulty: 'easy',
    },
    {
      id: 'q2',
      questionText: 'In ACID properties of a database transaction, which property guarantees that once a transaction has committed, its changes will survive system crashes?',
      type: 'mcq',
      options: [
        'Atomicity',
        'Consistency',
        'Isolation',
        'Durability',
      ],
      correctAnswerIndex: 3, // Durability
      explanation: 'Durability ensures that committed transactions are permanently recorded in non-volatile storage (like Write-Ahead Logs / disk) and survive power outages or server crashes.',
      sourceReference: 'Transaction Processing & Recovery, Section 14.1',
      difficulty: 'medium',
    },
    {
      id: 'q3',
      questionText: 'A B-Tree index maintains sorted keys and allows search, sequential access, insertions, and deletions in logarithmic time O(log n).',
      type: 'true_false',
      options: ['True', 'False'],
      correctAnswerIndex: 0, // True
      explanation: 'True. B-Trees and B+ Trees are self-balancing search trees that guarantee logarithmic O(log n) time complexity for search, insert, and delete operations on disk blocks.',
      sourceReference: 'Indexing and Hashing, Section 11.3',
      difficulty: 'easy',
    },
    {
      id: 'q4',
      questionText: 'What type of lock allows multiple concurrent transactions to read data simultaneously, but prevents any transaction from writing until all reads finish?',
      type: 'mcq',
      options: [
        'Exclusive Lock (X-lock)',
        'Shared Lock (S-lock)',
        'Intent Exclusive Lock (IX-lock)',
        'Spinlock',
      ],
      correctAnswerIndex: 1, // Shared Lock
      explanation: 'Shared Locks (S-locks) allow multiple transactions to read a shared resource concurrently. Write/update operations require an Exclusive Lock (X-lock).',
      sourceReference: 'Concurrency Control Protocols, Chapter 15',
      difficulty: 'medium',
    },
    {
      id: 'q5',
      questionText: 'A foreign key constraint always requires that the referenced column in the parent table cannot contain duplicate values.',
      type: 'true_false',
      options: ['True', 'False'],
      correctAnswerIndex: 0, // True
      explanation: 'True. A foreign key must reference either a PRIMARY KEY or a UNIQUE constraint column in the referenced parent table, guaranteeing uniqueness.',
      sourceReference: 'SQL Integrity Constraints, Section 3.3',
      difficulty: 'hard',
    },
  ],
};
