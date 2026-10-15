from typing import List, Dict, Any

# Curated educational question bank for popular CS domains
CURATED_TOPIC_BANKS: Dict[str, List[Dict[str, Any]]] = {
    "python": [
        {
            "questionText": "In Python, which built-in data type is immutable?",
            "type": "mcq",
            "options": ["List", "Dictionary", "Tuple", "Set"],
            "correctAnswerIndex": 2,
            "explanation": "Tuples are immutable sequences in Python; once defined, their elements cannot be added, removed, or reordered.",
            "sourceReference": "Python Standard Documentation: Data Structures",
            "difficulty": "easy"
        },
        {
            "questionText": "What does the '__init__' method represent in a Python class?",
            "type": "mcq",
            "options": [
                "A constructor method called upon object instantiation",
                "A destructor method called during garbage collection",
                "A static method requiring no instance reference",
                "A module initialization hook"
            ],
            "correctAnswerIndex": 0,
            "explanation": "The __init__ method is the class constructor automatically executed when a new instance of the class is created.",
            "sourceReference": "Python Object-Oriented Programming Standard",
            "difficulty": "easy"
        },
        {
            "questionText": "Python's Global Interpreter Lock (GIL) allows multiple native threads to execute Python bytecodes simultaneously on multiple CPU cores.",
            "type": "true_false",
            "options": ["True", "False"],
            "correctAnswerIndex": 1,
            "explanation": "False. The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at the same time in CPython.",
            "sourceReference": "CPython Internals & Concurrency Guide",
            "difficulty": "hard"
        },
        {
            "questionText": "What is the time complexity of looking up a key in a standard Python dictionary in the average case?",
            "type": "mcq",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            "correctAnswerIndex": 0,
            "explanation": "Python dictionaries are implemented as open-addressing hash tables, providing average O(1) time complexity for key lookups.",
            "sourceReference": "Python Complexity Wiki & Hash Table Implementation",
            "difficulty": "medium"
        },
        {
            "questionText": "In Python, list comprehensions are generally faster than equivalent for-loops because they are executed at C-level speed.",
            "type": "true_false",
            "options": ["True", "False"],
            "correctAnswerIndex": 0,
            "explanation": "True. List comprehensions are optimized at the bytecode level and perform list appending in internal C routines.",
            "sourceReference": "Fluent Python: Comprehensions and Generators",
            "difficulty": "medium"
        }
    ],
    "operating_systems": [
        {
            "questionText": "Which scheduling algorithm is non-preemptive and can cause the convoy effect?",
            "type": "mcq",
            "options": ["Round Robin", "Shortest Remaining Time First", "First-Come, First-Served (FCFS)", "Multilevel Feedback Queue"],
            "correctAnswerIndex": 2,
            "explanation": "In FCFS, if a long CPU-burst process arrives first, all short processes wait behind it, known as the convoy effect.",
            "sourceReference": "Operating System Concepts (Silberschatz), Chapter 5",
            "difficulty": "easy"
        },
        {
            "questionText": "Which of the following is NOT one of Coffman's four conditions required for a deadlock?",
            "type": "mcq",
            "options": ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
            "correctAnswerIndex": 2,
            "explanation": "The condition is 'No Preemption'. If preemption is allowed, deadlocks cannot occur.",
            "sourceReference": "Operating Systems Internals & Design Principles",
            "difficulty": "medium"
        },
        {
            "questionText": "Virtual memory allows the execution of processes that are not completely loaded into physical memory.",
            "type": "true_false",
            "options": ["True", "False"],
            "correctAnswerIndex": 0,
            "explanation": "True. Demand paging loads pages into physical memory frames only when referenced, separating logical from physical address space.",
            "sourceReference": "Modern Operating Systems (Tanenbaum), Chapter 3",
            "difficulty": "easy"
        },
        {
            "questionText": "What problem does the Translation Lookaside Buffer (TLB) solve in virtual memory paging?",
            "type": "mcq",
            "options": [
                "Reduces memory access time by caching recent virtual-to-physical address translations",
                "Prevents thrashing in high-load situations",
                "Enforces process security levels",
                "Compresses inactive disk blocks"
            ],
            "correctAnswerIndex": 0,
            "explanation": "The TLB is a high-speed associative hardware cache that eliminates the need to access the page table in RAM for every memory instruction.",
            "sourceReference": "Computer Architecture & OS Memory Hierarchy",
            "difficulty": "hard"
        }
    ],
    "artificial_intelligence": [
        {
            "questionText": "In search algorithms, which algorithm is guaranteed to find the shortest path if the heuristic function h(n) is admissible?",
            "type": "mcq",
            "options": ["Depth-First Search (DFS)", "A* Search", "Hill Climbing", "Breadth-First Search without heuristic"],
            "correctAnswerIndex": 1,
            "explanation": "A* search is provably optimal and complete if the heuristic h(n) is admissible (never overestimates the true cost to reach the goal).",
            "sourceReference": "Artificial Intelligence: A Modern Approach (Russell & Norvig)",
            "difficulty": "medium"
        },
        {
            "questionText": "Overfitting in machine learning occurs when a model performs exceptionally well on training data but poorly on unseen test data.",
            "type": "true_false",
            "options": ["True", "False"],
            "correctAnswerIndex": 0,
            "explanation": "True. Overfitting occurs when the model learns noise and specific details of the training set rather than the underlying general trend.",
            "sourceReference": "Pattern Recognition and Machine Learning (Bishop)",
            "difficulty": "easy"
        },
        {
            "questionText": "Which activation function suffers from the vanishing gradient problem for very high or very low input values?",
            "type": "mcq",
            "options": ["ReLU", "Sigmoid", "Leaky ReLU", "ELU"],
            "correctAnswerIndex": 1,
            "explanation": "Sigmoid saturates at 0 and 1, where its derivative is nearly zero, causing vanishing gradients during backpropagation.",
            "sourceReference": "Deep Learning (Goodfellow, Bengio, Courville)",
            "difficulty": "medium"
        }
    ],
    "data_structures": [
        {
            "questionText": "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?",
            "type": "mcq",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
            "correctAnswerIndex": 2,
            "explanation": "If elements are inserted in sorted order, an unbalanced BST degenerates into a linked list, resulting in O(n) worst-case search time.",
            "sourceReference": "Introduction to Algorithms (CLRS), Chapter 12",
            "difficulty": "easy"
        },
        {
            "questionText": "An AVL tree maintains balance by ensuring that the height difference between the left and right subtrees of any node is at most 1.",
            "type": "true_false",
            "options": ["True", "False"],
            "correctAnswerIndex": 0,
            "explanation": "True. The balance factor in an AVL tree must be -1, 0, or +1; otherwise, tree rotations are performed to restore balance.",
            "sourceReference": "Data Structures and Algorithm Analysis (Weiss)",
            "difficulty": "medium"
        }
    ]
}

def get_curated_topic_questions(topic_key: str, count: int, difficulty: str) -> List[Dict[str, Any]]:
    """Retrieve curated educational questions matching topic and difficulty"""
    bank = CURATED_TOPIC_BANKS.get(topic_key, CURATED_TOPIC_BANKS.get("python", []))
    
    # Filter by difficulty if not mixed
    if difficulty != "mixed":
        filtered = [q for q in bank if q.get("difficulty") == difficulty]
        pool = filtered if filtered else bank
    else:
        pool = bank

    # Repeat or slice to match requested count
    questions = []
    for idx in range(count):
        q_template = pool[idx % len(pool)]
        questions.append({
            "id": f"topic-q{idx + 1}",
            "questionText": q_template["questionText"],
            "type": q_template["type"],
            "options": q_template["options"],
            "correctAnswerIndex": q_template["correctAnswerIndex"],
            "explanation": q_template["explanation"],
            "sourceReference": q_template["sourceReference"],
            "difficulty": q_template["difficulty"]
        })

    return questions
