import { CourseSection } from '../types';

export const pythonCourseData: CourseSection[] = [
  {
    id: 'basics',
    title: '1. Python Basics & Syntax',
    description: 'Learn the core anatomy of Python, how to print outputs, and write clean readable code structure with indentation.',
    lessons: [
      {
        id: 'intro',
        title: 'Introduction to Python',
        summary: 'What is Python and why is it so popular for web dev, scripting, data science, and AI?',
        estimatedMinutes: 5,
        contentMarkdown: `### Welcome to Python!

Python is a high-level, human-friendly programming language created by **Guido van Rossum**, and released in 1991.

It is loved for its simplicity and used extensively in:
* **Web Development** (Django, Flask, FastAPI)
* **Data Science & AI** (Pandas, NumPy, PyTorch, Gemini API)
* **Automation & Scripting**

#### Your First Python Statement
To output text to the screen, Python uses the simple \`print()\` function:

\`\`\`python
print("Hello, World!")
\`\`\`
`,
        examples: [
          {
            id: 'ex-intro-1',
            title: 'Greeting the World',
            code: 'print("Hello, World!")',
            explanation: 'In Python, we simply use print() to output any text. Text values are enclosed in double or single quotes.',
            expectedOutput: 'Hello, World!'
          }
        ],
        quizQuestions: [
          {
            id: 'q-intro-1',
            type: 'multiple_choice',
            question: 'Which built-in Python function is used to output text in the console?',
            options: ['echo()', 'console.log()', 'print()', 'output()'],
            correctAnswer: 'print()',
            hint: 'It starts with "p" and outputs text to your screen.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'syntax',
        title: 'Python Syntax & Indentation',
        summary: 'Learn how indentation defines structural blocks in Python.',
        estimatedMinutes: 6,
        contentMarkdown: `### Python Indentation

In other programming languages, curly brackets \`{}\` are used to define a block of code.

In Python, we **exclusively use indentation** (spaces or tabs) to define blocks of code, such as functions, loops, or conditionals:

\`\`\`python
if 5 > 2:
    print("Five is greater than two!")
\`\`\`

If you skip indentation, Python will throw an \`IndentationError\` immediately:
\`\`\`python
# This fails!
if 5 > 2:
print("Unindented!")
\`\`\`
`,
        examples: [
          {
            id: 'ex-syntax-1',
            title: 'Correct Indentation',
            code: 'if 10 > 5:\n    print("10 is greater than 5!")',
            explanation: 'Indent by convention using exactly four spaces under statements containing colons.',
            expectedOutput: '10 is greater than 5!'
          }
        ],
        quizQuestions: [
          {
            id: 'q-syntax-1',
            type: 'code_completion',
            question: 'Complete the block so that the print outputs correctly inside the conditional branch:',
            codeContext: 'if 2 < 4:\n[PLACEHOLDER]print("2 is small")',
            correctAnswer: '    ',
            placeholderText: 'Type 4 spaces to indent',
            hint: 'Exactly four space characters represent the safe Python block convention.',
            xpValue: 25
          }
        ]
      },
      {
        id: 'comments',
        title: 'Python Comments',
        summary: 'Learn how to write non-executable notes in your source files to document logical workflows.',
        estimatedMinutes: 4,
        contentMarkdown: `### Python Comments

Comments are used to explain Python code and make it more readable. They are completely ignored by the interpreter:

* **Single-line comments** start with the hash character \`#\`.
* Any text after \`#\` on that line is treated as a comment.

\`\`\`python
# This is a comment before execution
print("Interactive Python") # Inline comment
\`\`\`
`,
        examples: [
          {
            id: 'ex-comments-1',
            title: 'Adding Code Comments',
            code: '# Displaying course name\nprint("SENAI Python Lab")',
            explanation: 'The hash sign instructs the compiler to disregard the line entirely.',
            expectedOutput: 'SENAI Python Lab'
          }
        ],
        quizQuestions: [
          {
            id: 'q-comments-1',
            type: 'multiple_choice',
            question: 'What character is used to start a single-line comment in Python?',
            options: ['//', '/*', '#', '<!--'],
            correctAnswer: '#',
            hint: 'It is also known as the hash icon or number sign.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'input',
        title: 'Interactive User Input',
        summary: 'Capture active keyboard responses from the user inside Python scripts.',
        estimatedMinutes: 5,
        contentMarkdown: `### The input() Function

Python lets us communicate with the user via terminal input using the built-in \`input()\` function:

* It pauses execution of the script and waits for keyboard input.
* It returns the typed response as a string.

\`\`\`python
name = "Erick" # Pre-simulated input
print("Your name is: " + name)
\`\`\`
`,
        examples: [
          {
            id: 'ex-input-1',
            title: 'Working with Variables & Inputs',
            code: 'favorite = "Python"\nprint("My favorite language is", favorite)',
            explanation: 'Storing user input variables lets us inject dynamic outputs into our strings.',
            expectedOutput: 'My favorite language is Python'
          }
        ],
        quizQuestions: [
          {
            id: 'q-input-1',
            type: 'fill_in_the_blank',
            question: 'What built-in function receives input keyboard signals from the developer console?',
            placeholderText: '____("Enter details")',
            correctAnswer: 'input',
            hint: 'It is the opposite of output.',
            xpValue: 20
          }
        ]
      },
      {
        id: 'basics_wrap',
        title: 'Basics Quick Wrap-up',
        summary: 'A fast test checking basic commands, terminal print outputs, and syntax indent rules.',
        estimatedMinutes: 4,
        contentMarkdown: `### Section 1 Wrap-up

Let's consolidate your knowledge of Python basics:
* \`print()\` outputs text fields or results.
* Colons \`:\` denote the starting points of internal nested logical blocks.
* Indentation (4 spaces) structures blocks.
* \`#\` starts single-line explanations.
`,
        examples: [
          {
            id: 'ex-wrap-1',
            title: 'Basics Showcase',
            code: '# Fast sanity test\nif True:\n    print("All checks passed!")',
            explanation: 'Perfect combination of comments, conditional branch, colons, and indentation.',
            expectedOutput: 'All checks passed!'
          }
        ],
        quizQuestions: [
          {
            id: 'q-wrap-1',
            type: 'multiple_choice',
            question: 'What is true about Python indentation blocks?',
            options: [
              'It is optional and used only for style',
              'It is strictly required to categorize programmatic scopes',
              'It is done using dollar signs',
              'It must be 10 spaces'
            ],
            correctAnswer: 'It is strictly required to categorize programmatic scopes',
            hint: 'Python reads spaces directly instead of matching curly brackets.',
            xpValue: 20
          }
        ]
      }
    ]
  },
  {
    id: 'variables',
    title: '2. Variables, Numbers & Booleans',
    description: 'Master dynamic variables, Python data types, numerical calculations, and logical conditions.',
    lessons: [
      {
        id: 'vars',
        title: 'Variables & Dynamic Typing',
        summary: 'How to declare variables instantly, naming rules, and dynamic data tags.',
        estimatedMinutes: 6,
        contentMarkdown: `### Python Variables

Think of variables as named containers storing your data.

Unlike languages like Java or C++, Python has **dynamic typing**:
* You do not need to compile types.
* Variable names are created automatically when values are assigned using the \`=\` operator.

\`\`\`python
x = 100
user = "Guilherme"
print(user, x)
\`\`\`
`,
        examples: [
          {
            id: 'ex-vars-1',
            title: 'Variable Declarations',
            code: 'age = 18\nname = "Lívia"\nprint(name, "is", age)',
            explanation: 'Creating standard dynamic variables of string and integer categories.',
            expectedOutput: 'Lívia is 18'
          }
        ],
        quizQuestions: [
          {
            id: 'q-vars-1',
            type: 'multiple_choice',
            question: 'Which variable assignment represents an illegal naming convention?',
            options: ['my_variable = 1', 'myVariable = 2', '2myvariable = 3', '_my_variable = 4'],
            correctAnswer: '2myvariable = 3',
            hint: 'A Python identifier cannot start with a numeric digit.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'booleans',
        title: 'Booleans & Comparison Operators',
        summary: 'Understand True & False booleans, comparison logic, and logical evaluations.',
        estimatedMinutes: 5,
        contentMarkdown: `### Python Booleans

Booleans represent one of two conceptual states: **True** or **False**.

Whenever you compare two statements, Python evaluates and outputs a Booleans object:
* \`==\` : Equal to
* \`!=\` : Not equal to
* \`>\` : Greater than
* \`<\` : Less than

Keep in mind that Boolean keys are strict about capitalization: \`True\` and \`False\` (NOT \`true\` or \`false\`).
`,
        examples: [
          {
            id: 'ex-bool-1',
            title: 'Evaluating Boolean Checks',
            code: 'print(10 > 20)\nprint(15 == 15)',
            explanation: 'Evaluates statements to return uppercase Boolean types.',
            expectedOutput: 'False\nTrue'
          }
        ],
        quizQuestions: [
          {
            id: 'q-bool-1',
            type: 'multiple_choice',
            question: 'What is the correct output of print(4 != 5)?',
            options: ['True', 'true', 'False', 'false'],
            correctAnswer: 'True',
            hint: '4 is indeed NOT equal to 5, and Python uses uppercase Booleans.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'numbers',
        title: 'Python Numbers & Operators',
        summary: 'Perform math using standard types like integers, floating decimals, and special operators.',
        estimatedMinutes: 6,
        contentMarkdown: `### Python Numbers

There are three numerical types in Python:
* \`int\` (Integers such as \`3\`, \`100\`)
* \`float\` (Decimals containing point values like \`3.14\`, \`-0.5\`)
* \`complex\` (Complex numbers like \`3 + 5j\`)

#### Math Operators
* \`+\`, \`-\`, \`*\`, \`/\` are standard.
* **Modulo** (\`%\`) outputs the remainder of a division.
* **Exponentiation** (\`**\`) calculates power values.

\`\`\`python
print(5 % 2)   # 1 (remainder)
print(2 ** 3)  # 8 (2 raised to power 3)
\`\`\`
`,
        examples: [
          {
            id: 'ex-num-1',
            title: 'Mathematical Calculations',
            code: 'remainder = 10 % 3\npower = 3 ** 2\nprint(remainder, power)',
            explanation: 'Using modulo to extract decimals and power equations.',
            expectedOutput: '1 9'
          }
        ],
        quizQuestions: [
          {
            id: 'q-num-1',
            type: 'fill_in_the_blank',
            question: 'Fill in the mathematical operator to get the remainder of 7 divided by 3:',
            placeholderText: 'remainder = 7 ____ 3',
            correctAnswer: '%',
            hint: 'It is the percentage key/modulo sign.',
            xpValue: 20
          }
        ]
      },
      {
        id: 'strings',
        title: 'Python Strings',
        summary: 'Master string literals, operations, length metrics, and joining texts.',
        estimatedMinutes: 6,
        contentMarkdown: `### Python Strings

Strings are sequences of characters surrounded by single or double quotes:

\`\`\`python
msg = "Welcome Pythonista"
# Get the length using len()
print(len(msg))
\`\`\`

#### Concatenation
Join text strings together by utilizing the simple plus \`+\` sign:
\`\`\`python
hello = "Hello " + "Julia"
print(hello)
\`\`\`
`,
        examples: [
          {
            id: 'ex-str-1',
            title: 'Combining Text Strings',
            code: 'first = "Aslan"\nlast = "Rodrigues"\nprint(first + " " + last)',
            explanation: 'Add spaces safely inside text joins using quotes.',
            expectedOutput: 'Aslan Rodrigues'
          }
        ],
        quizQuestions: [
          {
            id: 'q-str-1',
            type: 'multiple_choice',
            question: 'Which built-in function returns the total number of characters in a string?',
            options: ['size()', 'length()', 'count()', 'len()'],
            correctAnswer: 'len()',
            hint: 'A short four-letter abbreviation for length.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'casting',
        title: 'Type Casting & Class Verification',
        summary: 'Manually specify or convert variables between strings, integers, and floats.',
        estimatedMinutes: 5,
        contentMarkdown: `### Python Casting

Casting makes it possible to specify or convert data styles:
* **\`int()\`**: Transforms data into an integer.
* **\`float()\`**: Converts values into decimals.
* **\`str()\`**: Serializes items into strings.

\`\`\`python
x = int("12")      # turns "12" string to integer 12
y = float("3.14")  # turns string type to decimal Float
\`\`\`
`,
        examples: [
          {
            id: 'ex-cast-1',
            title: 'Casting Variables on the Fly',
            code: 'val = str(101)\nprint("Code is: " + val)',
            explanation: 'Converting number 101 to "101" to append with string text.',
            expectedOutput: 'Code is: 101'
          }
        ],
        quizQuestions: [
          {
            id: 'q-cast-1',
            type: 'multiple_choice',
            question: 'What is the output of print(int(3.8))?',
            options: ['4', '3', '3.8', 'Error'],
            correctAnswer: '3',
            hint: 'int() chops off/truncates decimal places, leaving only the primary integer.',
            xpValue: 15
          }
        ]
      }
    ]
  },
  {
    id: 'control-flow',
    title: '3. Conditions & Iterative Loops',
    description: 'Learn conditional mapping (if/elif/else) and writing smart, repeating execution codes with loops.',
    lessons: [
      {
        id: 'ifelse',
        title: 'If... Else Conditions',
        summary: 'Learn standard decision-making syntax using conditional branches.',
        estimatedMinutes: 6,
        contentMarkdown: `### Conditional Branches

Python uses standard conditional flags to branch code execution path:
* **\`if\`**: Exposes a block to execute if a condition is true.
* **\`elif\`**: Checks alternate conditions if prior assertions fail.
* **\`else\`**: Fallback when all tests fail.

\`\`\`python
grade = 80
if grade >= 90:
    print("Excellent")
elif grade >= 70:
    print("Satisfactory")
else:
    print("Try Again")
\`\`\`
`,
        examples: [
          {
            id: 'ex-ifelse-1',
            title: 'Decisive Flow Paths',
            code: 'temp = 15\nif temp < 20:\n    print("Fresh Climate")',
            explanation: 'Indented lines under colons run if the statement checks True.',
            expectedOutput: 'Fresh Climate'
          }
        ],
        quizQuestions: [
          {
            id: 'q-ifelse-1',
            type: 'multiple_choice',
            question: 'Which shorthand keyword represents "else if" in Python?',
            options: ['elseif', 'elsif', 'elif', 'else_if'],
            correctAnswer: 'elif',
            hint: 'Short 4-letter contraction widely selected by Python architects.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'loops',
        title: 'While & For Loops',
        summary: 'Command scripts to repeat statements as long as rules remain true.',
        estimatedMinutes: 7,
        contentMarkdown: `### Python Loops

Repeat instructions using these loop tools:

#### 1. The while Loop
Runs statements continuously as long as the rule calculates to \`True\`:
\`\`\`python
i = 1
while i < 4:
    print(i)
    i += 1
\`\`\`

#### 2. The for Loop
Iterates over a sequence (typically ranges, lists):
\`\`\`python
for x in [1, 2]:
    print(x)
\`\`\`
`,
        examples: [
          {
            id: 'ex-loops-1',
            title: 'Basic Iterative Addition',
            code: 'x = 1\nwhile x <= 3:\n    print(x)\n    x += 1',
            explanation: 'Loops print the variable x, incrementing it each turn.',
            expectedOutput: '1\n2\n3'
          }
        ],
        quizQuestions: [
          {
            id: 'q-loops-1',
            type: 'multiple_choice',
            question: 'Which statement immediately exits a loop regardless of condition state?',
            options: ['break', 'continue', 'pass', 'stop'],
            correctAnswer: 'break',
            hint: 'A word matching shattering glass.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'nested_if',
        title: 'Nested If Statements',
        summary: 'Implement nested decision-making matrices where "if" statements live inside other "if" checks.',
        estimatedMinutes: 5,
        contentMarkdown: `### Nested Conditions

In Python, you can write \`if\` statements inside existing \`if\` statement blocks. This is called nesting:

\`\`\`python
num = 15
if num > 10:
    print("More than 10")
    if num > 20:
        print("More than 20")
    else:
        print("But not more than 20")
\`\`\`
`,
        examples: [
          {
            id: 'ex-nested-1',
            title: 'Nesting Decision Check',
            code: 'a = 12\nif a > 5:\n    if a == 12:\n        print("Double Success")',
            explanation: 'Second block runs only after passing the exterior larger-than-5 test.',
            expectedOutput: 'Double Success'
          }
        ],
        quizQuestions: [
          {
            id: 'q-nested-1',
            type: 'multiple_choice',
            question: 'How does Python know which if statements are nested inside another?',
            options: [
              'By tracing nested brackets',
              'By parsing nested indent spaces',
              'By reading parenthesis levels',
              'It does it automatically'
            ],
            correctAnswer: 'By parsing nested indent spaces',
            hint: 'Layout alignment defines hierarchy in Python.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'logical_ops',
        title: 'Logical Operators',
        summary: 'Link multiple conditions together utilizing and, or, and not assertions.',
        estimatedMinutes: 6,
        contentMarkdown: `### Python Logical Operators

Link checks together:
* **\`and\`**: Returns True if **both** sides prove True.
* **\`or\`**: Returns True if **at least one** side evaluates to True.
* **\`not\`**: Reverses the current boolean state.

\`\`\`python
x = 5
print(x > 3 and x < 10)  # True (Both statements check out)
print(x > 10 or x < 4)   # False (Neither statement checks out)
\`\`\`
`,
        examples: [
          {
            id: 'ex-logic-1',
            title: 'Chaining Logics',
            code: 'score = 85\nis_happy = score > 80 and score < 90\nprint("Result:", is_happy)',
            explanation: 'Both criteria are evaluated to determine the final product.',
            expectedOutput: 'Result: True'
          }
        ],
        quizQuestions: [
          {
            id: 'q-logic-1',
            type: 'fill_in_the_blank',
            question: 'Fill in the keyword that changes True values back to False:',
            placeholderText: 'is_it_false = ____ True',
            correctAnswer: 'not',
            hint: 'A simple three letter negative prefix keyword.',
            xpValue: 20
          }
        ]
      },
      {
        id: 'range_fn',
        title: 'The range() Function',
        summary: 'Generate sequential paths of numbers dynamically, specifying custom bounds and intervals.',
        estimatedMinutes: 5,
        contentMarkdown: `### The range() Core Function

To loop a specific amount of times, Python leverages standard generator functions:
* **\`range(stop)\`**: Starts at 0, ends before stop.
* **\`range(start, stop)\`**: Range starts at start, stops before stop.
* **\`range(start, stop, step)\`**: Increments values using step parameters.

\`\`\`python
for x in range(3):
    print(x) # 0, 1, 2
\`\`\`
`,
        examples: [
          {
            id: 'ex-range-1',
            title: 'Custom Range Steps',
            code: 'for x in range(2, 7, 2):\n    print(x)',
            explanation: 'Starts loop at offset 2, increments by 2, stops at less than 7.',
            expectedOutput: '2\n4\n6'
          }
        ],
        quizQuestions: [
          {
            id: 'q-range-1',
            type: 'multiple_choice',
            question: 'What values are produced by the sequence range(1, 4)?',
            options: ['[1, 2, 3]', '[1, 2, 3, 4]', '[0, 1, 2, 3, 4]', '[2, 3, 4]'],
            correctAnswer: '[1, 2, 3]',
            hint: 'The range stops strictly BEFORE the second target value.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'list_loops',
        title: 'Iterating Lists with Loops',
        summary: 'Feed data collection arrays directly into loop blocks to navigate values easily.',
        estimatedMinutes: 5,
        contentMarkdown: `### Traversing Sequences

You can iterate directly over list sequences:

\`\`\`python
fruits = ["apple", "banana"]
for fruit in fruits:
    print(fruit)
\`\`\`
The loop pulls items out one by one, binding them to \`fruit\` on each iteration.
`,
        examples: [
          {
            id: 'ex-listloops-1',
            title: 'Iterating through Lists',
            code: 'names = ["João", "Breno"]\nfor name in names:\n    print("Hello", name)',
            explanation: 'Automatically executes statement cycles equal to the items array length.',
            expectedOutput: 'Hello João\nHello Breno'
          }
        ],
        quizQuestions: [
          {
            id: 'q-listloops-1',
            type: 'code_completion',
            question: 'Complete the loop to inspect student rosters:',
            codeContext: 'roster = ["Aslan", "Kamily"]\n[PLACEHOLDER] student in roster:\n    print(student)',
            correctAnswer: 'for',
            placeholderText: 'Loop keyword...',
            hint: 'Key four-letter keyword representing iterating sequences.',
            xpValue: 20
          }
        ]
      },
      {
        id: 'break_control',
        title: 'The Break Keyword',
        summary: 'Stop and terminate a loop completely and jump to the core code underneath.',
        estimatedMinutes: 6,
        contentMarkdown: `### Fast Loop Exit

Use the \`break\` keyword to completely exit loops early when structural goals are resolved:

\`\`\`python
i = 1
while i < 100:
    if i == 3:
        break
    print(i)
    i += 1
\`\`\`
When \`i\` equals 3, the script halts the loop immediately.
`,
        examples: [
          {
            id: 'ex-break-1',
            title: 'Exiting Loop Early',
            code: 'for val in range(10):\n    if val == 2:\n        break\n    print(val)',
            explanation: 'Prints 0 then 1; breaks before printing 2.',
            expectedOutput: '0\n1'
          }
        ],
        quizQuestions: [
          {
            id: 'q-break-1',
            type: 'multiple_choice',
            question: 'What is printed by ranges with break statements triggering at index 0?',
            options: ['Nothing', '0', 'Index values', 'Infinite lines'],
            correctAnswer: 'Nothing',
            hint: 'The loop exits before any statements undergo printing.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'continue_control',
        title: 'The Continue Keyword',
        summary: 'Skip commands remaining in current cycles and advance cleanly to subsequent loops.',
        estimatedMinutes: 5,
        contentMarkdown: `### Skipping Iterations

The \`continue\` keyword skips execution for the **current** loop cycle only:

\`\`\`python
for x in range(4):
    if x == 2:
        continue
    print(x) # 0, 1, 3 (skips 2!)
\`\`\`
`,
        examples: [
          {
            id: 'ex-continue-1',
            title: 'Using Continue',
            code: 'for i in range(1, 4):\n    if i == 2:\n        continue\n    print(i)',
            explanation: 'Skips printing when variable equals 2, continuing normally with index 3.',
            expectedOutput: '1\n3'
          }
        ],
        quizQuestions: [
          {
            id: 'q-continue-1',
            type: 'multiple_choice',
            question: 'What does the continue keyword do?',
            options: [
              'Terminates the loop completely',
              'Skips the remaining code in the current iteration and goes to the next cycle',
              'Restarts the program',
              'Outputs a blank space'
            ],
            correctAnswer: 'Skips the remaining code in the current iteration and goes to the next cycle',
            hint: 'It advances processing to the next turn of the engine.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'loop_else',
        title: 'The Loop Else Statement',
        summary: 'Use Python\'s unique functionality to trigger else branches when loops complete cleanly.',
        estimatedMinutes: 5,
        contentMarkdown: `### Else block in loops

Uniquely in Python, loops can contain an optional \`else\` block:
* Runs once the loop finishes structural sequences naturally.
* Stays **inactive/skipped** if the loop got forced out with any \`break\` keyword.

\`\`\`python
for x in range(3):
    print(x)
else:
    print("Done!") # executes!
\`\`\`
`,
        examples: [
          {
            id: 'ex-loopelse-1',
            title: 'Completing Clean Loops',
            code: 'for x in range(2):\n    print(x)\nelse:\n    print("Clean Loop")',
            explanation: 'Shows numeric digits 0 and 1, followed directly by Clean Loop execution.',
            expectedOutput: '0\n1\nClean Loop'
          }
        ],
        quizQuestions: [
          {
            id: 'q-loopelse-1',
            type: 'multiple_choice',
            question: 'Under what condition does the loop else block NOT execute?',
            options: [
              'If the loop completes all iterations',
              'If the loop is exited early via break',
              'If the condition is checked twice',
              'Always executes regardless'
            ],
            correctAnswer: 'If the loop is exited early via break',
            hint: 'Break stops both loops and their supplementary components.',
            xpValue: 20
          }
        ]
      },
      {
        id: 'infinite_loop',
        title: 'Infinite Loop Avoidance',
        summary: 'Write bulletproof conditional loops by preventing endless execution traps.',
        estimatedMinutes: 6,
        contentMarkdown: `### Loop Protection

An infinite loop is code that runs forever because its stopping condition is never met:

\`\`\`python
# WARNING: Infinite loop!
# x = 1
# while x < 5:
#     print(x) # x never increases!
\`\`\`

#### Preventing Infinite Loops
Always confirm the loop variable is modified inside the block so that the loop condition eventually evaluates to False:
\`\`\`python
# Correct implementation
x = 1
while x < 5:
    print(x)
    x += 1 # safe increments!
\`\`\`
`,
        examples: [
          {
            id: 'ex-infinite-1',
            title: 'Loop Variables Check',
            code: 'limit = 10\nwhile limit > 8:\n    print("Limit:", limit)\n    limit -= 1',
            explanation: 'Decrements limit every cycle, guaranteeing termination.',
            expectedOutput: 'Limit: 10\nLimit: 9'
          }
        ],
        quizQuestions: [
          {
            id: 'q-infinite-1',
            type: 'multiple_choice',
            question: 'What is crucial to include inside a while loop to prevent infinite loops?',
            options: [
              'A break statement in every iteration',
              'An increment or decrement that eventually makes the loop condition False',
              'A string print function',
              'An indentation error'
            ],
            correctAnswer: 'An increment or decrement that eventually makes the loop condition False',
            hint: 'Ensure your test variable gets closer to the stopping point.',
            xpValue: 15
          }
        ]
      }
    ]
  },
  {
    id: 'datastructs',
    title: '4. Python Collections (Lists & Diffs)',
    description: 'Structure array collections and fast key-value maps with Python Lists and Dictionary collections.',
    lessons: [
      {
        id: 'lists',
        title: 'Python Lists',
        summary: 'Ordered, editable arrays. Slice and append data cells cleanly.',
        estimatedMinutes: 6,
        contentMarkdown: `### Python Lists

Lists are used to store multiple items in a single variable:
* Lists are **ordered** and indexes start at 0.
* Lists are **changeable**, allowing add/erase elements.
* Defined using brackets \`[]\`.

\`\`\`python
fruits = ["apple", "cherry"]
fruits.append("mango")
print(fruits)
\`\`\`
`,
        examples: [
          {
            id: 'ex-lists-1',
            title: 'List Additions',
            code: 'tech = ["PC"]\ntech.append("Laptop")\nprint(tech)',
            explanation: 'Manipulate lists by adding items with append().',
            expectedOutput: "['PC', 'Laptop']"
          }
        ],
        quizQuestions: [
          {
            id: 'q-lists-1',
            type: 'multiple_choice',
            question: 'Which method adds an item to the end of a list?',
            options: ['insert()', 'add()', 'push()', 'append()'],
            correctAnswer: 'append()',
            hint: 'Think of adding notes to the end of a book chapter.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'dicts',
        title: 'Python Dictionaries',
        summary: 'Learn key-value pairs to represent maps and database records.',
        estimatedMinutes: 7,
        contentMarkdown: `### Python Dictionaries

Dictionaries store data inside **key:value** pairing arrays:
* Dictionaries are ordered (Python 3.7+) and mutable.
* They prohibit duplicate keys.
* Initiated with curly brackets \`{}\`.

\`\`\`python
user = {
  "username": "Erick",
  "xp": 100
}
print(user["username"])
\`\`\`
`,
        examples: [
          {
            id: 'ex-dicts-1',
            title: 'Dictionary Record Keys',
            code: 'car = {"make": "Ford"}\ncar["color"] = "Blue"\nprint(car["color"])',
            explanation: 'Inject key value indicators to update mappings.',
            expectedOutput: 'Blue'
          }
        ],
        quizQuestions: [
          {
            id: 'q-dicts-1',
            type: 'multiple_choice',
            question: 'Which curly symbol is used to start a dictionary literal?',
            options: ['{}', '[]', '()', '<>'],
            correctAnswer: '{}',
            hint: 'Usually referred to as brace characters.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'tuples',
        title: 'Python Tuples',
        summary: 'Explore ordered, unchangeable collection types used for static databases.',
        estimatedMinutes: 5,
        contentMarkdown: `### Tuple Collections

Tuples are collections that are **ordered** and **unchangeable (immutable)**:
* They are declared using round parentheses \`()\`.
* They offer faster execution times than standard Lists because they can't be modified after creation.

\`\`\`python
dimensions = (1920, 1080)
print(dimensions[0])
\`\`\`
`,
        examples: [
          {
            id: 'ex-tuples-1',
            title: 'Accessing Tuple Records',
            code: 'coordinates = (12, 45)\nprint("Lat is:", coordinates[0])',
            explanation: 'Read tuple index spots just like standard lists.',
            expectedOutput: 'Lat is: 12'
          }
        ],
        quizQuestions: [
          {
            id: 'q-tuples-1',
            type: 'multiple_choice',
            question: 'Which is a defining property of a Python Tuple?',
            options: [
              'Items can be appended dynamically',
              'Items cannot be modified once declared',
              'They use curly brackets',
              'Keys are case insensitive'
            ],
            correctAnswer: 'Items cannot be modified once declared',
            hint: 'Tuples are completely rigid/immutable.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'sets',
        title: 'Python Sets',
        summary: 'Filter unique values using unordered, unindexed collections.',
        estimatedMinutes: 5,
        contentMarkdown: `### Set Collections

A Python \`set\` is an **unordered** and **unindexed** collection:
* They do not allow duplicate items.
* They are defined with curly brackets \`{}\` (but do not have key-value pairs).

\`\`\`python
colors = {"red", "blue", "red"}
print("red" in colors) # quickly search membership
# Set filters duplicate items automatically!
\`\`\`
`,
        examples: [
          {
            id: 'ex-sets-1',
            title: 'Removing Duplicates with Sets',
            code: 'numbers = {1, 2, 2, 3}\nprint("Set size is:", len(numbers))',
            explanation: 'The double digit 2 is ignored, shrinking set size down to 3.',
            expectedOutput: 'Set size is: 3'
          }
        ],
        quizQuestions: [
          {
            id: 'q-sets-1',
            type: 'multiple_choice',
            question: 'What is the resulting output representing unique values output by printing set {1, 1, 2}?',
            options: ['{1, 1, 2}', '{1, 2}', '{2}', 'error'],
            correctAnswer: '{1, 2}',
            hint: 'Duplicates elements undergo complete filtration.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'collections_len',
        title: 'Collection Queries & Checking',
        summary: 'Determine element volume and check item membership cleanly with "in" checks.',
        estimatedMinutes: 5,
        contentMarkdown: `### Collection Metrics

Use these built-in helpers to manage lists and mappings:
* **\`len(collection)\`**: Counts the items of any list, tuple, dictionary, or set.
* **\`in\` / \`not in\`**: Returns True/False indicating whether an item exists in the collection.

\`\`\`python
items = ["pencil", "book"]
print("pencil" in items) # True
\`\`\`
`,
        examples: [
          {
            id: 'ex-queries-1',
            title: 'Counting and Searching',
            code: 'users = ["Alice", "Breno"]\nprint(len(users))\nprint("Alice" in users)',
            explanation: 'Extract lists elements count and confirm the presence of certain target strings.',
            expectedOutput: '2\nTrue'
          }
        ],
        quizQuestions: [
          {
            id: 'q-queries-1',
            type: 'multiple_choice',
            question: 'Which keyword searches for values directly inside list collections?',
            options: ['has', 'contains', 'in', 'find'],
            correctAnswer: 'in',
            hint: 'A tiny two-letter keyword matching english language checks.',
            xpValue: 15
          }
        ]
      }
    ]
  },
  {
    id: 'functions',
    title: '5. Python Functions & Modular Code',
    description: 'Consolidate executable logic flow inside structured defined blocks utilizing parameters and returns.',
    lessons: [
      {
        id: 'defs',
        title: 'Creating and Calling Functions',
        summary: 'How to organize reusable operations using the "def" syntax.',
        estimatedMinutes: 6,
        contentMarkdown: `### Python Functions

A function is a block of organized, reusable code used to perform a single action resourcefully:
* Functions are declared using the **\`def\`** keyword.
* Call functions using their names followed by parentheses.

\`\`\`python
def greet():
    print("Welcome Student!")

greet() # trigger function
\`\`\`
`,
        examples: [
          {
            id: 'ex-defs-1',
            title: 'Simple Function Call',
            code: 'def start_lab():\n    print("SENAI Python Lab Loaded")\n\nstart_lab()',
            explanation: 'Declaring custom functions with def and executing it afterwards.',
            expectedOutput: 'SENAI Python Lab Loaded'
          }
        ],
        quizQuestions: [
          {
            id: 'q-defs-1',
            type: 'multiple_choice',
            question: 'What keyword starts a function definition in Python?',
            options: ['function', 'def', 'void', 'define'],
            correctAnswer: 'def',
            hint: 'It is short for "define".',
            xpValue: 15
          }
        ]
      },
      {
        id: 'params',
        title: 'Function Parameters & Arguments',
        summary: 'Pass dynamic datasets seamlessly inside function operations.',
        estimatedMinutes: 5,
        contentMarkdown: `### Function Arguments

Parameters act as variables inside function definitions, receiving inputs called arguments when executed:

\`\`\`python
def greet_student(name):
    print("Welcome, " + name)

greet_student("Sarah") # passes argument
\`\`\`
`,
        examples: [
          {
            id: 'ex-params-1',
            title: 'Dynamic Variables',
            code: 'def show_add(a, b):\n    print("Sum:", a + b)\n\nshow_add(10, 5)',
            explanation: 'Passing inputs to print custom calculation metrics.',
            expectedOutput: 'Sum: 15'
          }
        ],
        quizQuestions: [
          {
            id: 'q-params-1',
            type: 'fill_in_the_blank',
            question: 'How do we separate multiple parameter parameters in function declarations?',
            placeholderText: 'def add(num1 ____ num2):',
            correctAnswer: ',',
            hint: 'A simple comma character separates parameters.',
            xpValue: 20
          }
        ]
      },
      {
        id: 'returns',
        title: 'The Return Statement',
        summary: 'Extract processed outcomes and variables out of functions back to parent scopes.',
        estimatedMinutes: 5,
        contentMarkdown: `### Returning Values

To let a function send values back to the code that called it, use the **\`return\`** keyword:

\`\`\`python
def triple(x):
    return x * 3

result = triple(4) # result gets 12
print(result)
\`\`\`
`,
        examples: [
          {
            id: 'ex-returns-1',
            title: 'Extracting Calculations',
            code: 'def square(n):\n    return n * n\n\nprint(square(5))',
            explanation: 'Passes value outside to the wrapping print expression.',
            expectedOutput: '25'
          }
        ],
        quizQuestions: [
          {
            id: 'q-returns-1',
            type: 'multiple_choice',
            question: 'What keyword outputs data from functions, halting code block execution within them?',
            options: ['output', 'send', 'return', 'exit'],
            correctAnswer: 'return',
            hint: 'Sends a value back to its origin.',
            xpValue: 15
          }
        ]
      },
      {
        id: 'default_args',
        title: 'Default Parameter Values',
        summary: 'Define fallback parameters to process triggers running without arguments.',
        estimatedMinutes: 5,
        contentMarkdown: `### Defaults parameters

If you call a function without passing arguments, it can fall back to a predefined **default value**:

\`\`\`python
def welcome(state="Active"):
    print("Student is", state)

welcome("Learning") # prints "Student is Learning"
welcome()            # prints "Student is Active"
\`\`\`
`,
        examples: [
          {
            id: 'ex-defaults-1',
            title: 'Using Defaults parameters',
            code: 'def describe_student(name="Apprentice"):\n    print("Status:", name)\n\ndescribe_student()',
            explanation: 'Prints the assigned fallback since we triggered empty brackets.',
            expectedOutput: 'Status: Apprentice'
          }
        ],
        quizQuestions: [
          {
            id: 'q-defaults-1',
            type: 'fill_in_the_blank',
            question: 'Configure parameter name to fall back to "User" if left empty:',
            placeholderText: 'def greet(name____"User"):',
            correctAnswer: '=',
            hint: 'Use the equality sign matching parameter variable binding.',
            xpValue: 20
          }
        ]
      },
      {
        id: 'lambda_fns',
        title: 'Python Lambda Functions',
        summary: 'Construct highly efficient single line anonymous code functions.',
        estimatedMinutes: 5,
        contentMarkdown: `### Anonymous Functions

A **lambda** function is a small, anonymous (unnamed) function:
* It can take any number of arguments, but can only have **one** expression.
* Defined using the \`lambda\` keyword.

\`\`\`python
# Inline addition function
add_ten = lambda x : x + 10
print(add_ten(5)) # 15
\`\`\`
`,
        examples: [
          {
            id: 'ex-lambda-1',
            title: 'Evaluating Lambdas',
            code: 'multiply = lambda a, b : a * b\nprint(multiply(4, 5))',
            explanation: 'Create lightweight inline expressions without using the verbose def keyword.',
            expectedOutput: '20'
          }
        ],
        quizQuestions: [
          {
            id: 'q-lambda-1',
            type: 'multiple_choice',
            question: 'Which keyword creates small anonymous/unnamed functions in Python?',
            options: ['def', 'anonymous', 'inline', 'lambda'],
            correctAnswer: 'lambda',
            hint: 'Named after the eleventh letter of the Greek alphabet.',
            xpValue: 20
          }
        ]
      }
    ]
  },
  {
    id: 'project',
    title: '6. Final Hands-On Coding Project',
    description: 'Solve a real-world coding problem by applying loops, variables, conditional statements, and arithmetic operators.',
    lessons: [
      {
        id: 'grading_project_lesson',
        title: 'School Grading System Project',
        summary: 'Build a practical student grades evaluator that calculates averages and classifies marks.',
        estimatedMinutes: 20,
        contentMarkdown: `### Real-World Project challenge

In this final hands-on lab, you will combine variables, arithmetic operators, types conversion, and conditionals to build an automated **School Grading System**!

#### Project Instructions:
Write a complete, working Python script that does the following:
1. Define three numeric variables representing three test scores: \`score1\`, \`score2\`, and \`score3\`. (e.g. \`8.5\`, \`9.0\`, \`9.5\` or similar floating-point or integer values).
2. Calculate the mathematical **average** of these three test scores.
3. Display the computed average in the output terminal (print it).
4. Categorize and print a standard grade card message based on the average:
   * Average **exactly 10**: Print exactly \`"Perfect"\`
   * Average **between 8 and 9.9** (inclusive): Print exactly \`"Very good"\`
   * Average **between 5 and 7.9** (inclusive): Print exactly \`"Good"\`
   * Average **between 1 and 4.9** (inclusive): Print exactly \`"Need to improve"\`

#### Example Structure & Flow:
\`\`\`python
# 1. Initialize three test scores
score1 = 9.0
score2 = 8.0
score3 = 10.0

# 2. Compute the mathematical average value
average = (score1 + score2 + score3) / 3

# 3. Print your computed average
print("Average calculated:", average)

# 4. Check classifications and display appropriate grade
if average == 10:
    print("Perfect")
elif average >= 8:
    print("Very good")
elif average >= 5:
    print("Good")
else:
    print("Need to improve")
\`\`\`
`,
        examples: [
          {
            id: 'ex-project-1',
            title: 'Grading System Starter',
            code: '# 1. Set your 3 scores here\nscore1 = 8.0\nscore2 = 9.5\nscore3 = 9.5\n\n# 2. Calculate average and print\n# 3. Code your conditional grading scale below...\naverage = (score1 + score2 + score3) / 3\nprint("Average:", average)\n\n# 4. Use if/elif/else to print the grades ("Perfect", "Very good", "Good", "Need to improve")',
            explanation: 'Begin building your final graduation script directly inside our sandbox terminal! Choose any score variables you wish.',
            expectedOutput: ''
          }
        ],
        quizQuestions: [
          {
            id: 'q-project-1',
            type: 'multiple_choice',
            question: 'Which comparison operator is ideal for checking if the student average is exactly 10?',
            options: ['=', '==', '===', 'eq'],
            correctAnswer: '==',
            hint: 'The double equals represents logical comparison/equality check in Python.',
            xpValue: 30
          }
        ]
      }
    ]
  }
];
