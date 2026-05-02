import { ExamData } from '../types/exam';

export const mockIELTSReading: ExamData = {
  id: 'ielts-reading-1',
  type: 'IELTS',
  skill: 'Reading',
  title: 'IELTS Academic Reading: Practice Test 1',
  duration: 3600,
  sections: [
    {
      id: 'r-sec-1',
      title: 'Passage 1: The Step Pyramid of Djoser',
      content: `The Step Pyramid of Djoser, located in the Saqqara necropolis, is one of the most enigmatic and significant structures of ancient Egypt. Built during the 27th century BC for the burial of Pharaoh Djoser, it was designed by his vizier, Imhotep. This monument marks a crucial turning point in Egyptian architecture, as it was the first pyramid ever built and represents the transition from the traditional mastaba tombs to the iconic pyramid shape.

Before Djoser, Pharaohs and high-ranking officials were buried in mastabas—flat-roofed, rectangular structures made of sun-dried mud bricks. Imhotep’s innovation was to stack six mastabas on top of each other, each smaller than the one below, eventually reaching a height of 62 meters. This was also the first time that stone was used on such a massive scale in construction, replacing mud bricks and wood.

The complex surrounding the pyramid is equally impressive. It includes a series of dummy buildings and courtyards intended for the Pharaoh’s use in the afterlife. One of the most famous areas is the Great South Court, where Djoser is believed to have performed the Heb-Sed festival, a ritual intended to renew the King's power after 30 years of rule. Recent excavations have revealed a vast network of underground tunnels and chambers, extending over 6 kilometers, which served as the burial place for the King and his family.`,
      questions: [
        {
          id: 'rq1',
          type: 'multiple-choice',
          groupTitle: 'Questions 1-3: Multiple Choice',
          question: 'Who was the architect responsible for the Step Pyramid?',
          options: ['Pharaoh Djoser', 'Imhotep', 'Khufu', 'Tutankhamun'],
          correctAnswer: 'Imhotep',
          explanation: 'The passage states: "Built during the 27th century BC for the burial of Pharaoh Djoser, it was designed by his vizier, Imhotep."'
        },
        {
          id: 'rq2',
          type: 'multiple-choice',
          question: 'What was the height of the Step Pyramid?',
          options: ['30 meters', '45 meters', '62 meters', '100 meters'],
          correctAnswer: '62 meters',
          explanation: 'The text mentions the pyramid reached a height of 62 meters.'
        },
        {
          id: 'rq3',
          type: 'multiple-choice',
          question: 'What was the purpose of the Heb-Sed festival?',
          options: ['To celebrate a military victory', 'To renew the King’s power', 'To mourn the previous Pharaoh', 'To mark the beginning of a harvest'],
          correctAnswer: 'To renew the King’s power',
          explanation: 'The passage describes it as "a ritual intended to renew the King\'s power after 30 years of rule."'
        },
        {
          id: 'rq4',
          type: 'multiple-choice',
          groupTitle: 'Questions 4-6: True / False / Not Given',
          question: 'Djoser was the first Pharaoh to be buried in Saqqara.',
          options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          correctAnswer: 'NOT GIVEN',
          explanation: 'The text says the pyramid is in the Saqqara necropolis, but it doesn\'t state he was the *first* Pharaoh buried there.'
        },
        {
          id: 'rq5',
          type: 'multiple-choice',
          question: 'Stone was used for construction before the Step Pyramid was built.',
          options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          correctAnswer: 'FALSE',
          explanation: 'The text states: "This was also the first time that stone was used on such a massive scale in construction, replacing mud bricks and wood."'
        },
        {
          id: 'rq6',
          type: 'multiple-choice',
          question: 'The underground tunnels were used for more than just the King’s burial.',
          options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          correctAnswer: 'TRUE',
          explanation: 'The text says the tunnels "served as the burial place for the King and his family."'
        }
      ]
    },
    {
      id: 'r-sec-2',
      title: 'Passage 2: The Evolution of Language',
      content: `Language is perhaps the most distinctive human trait, yet its origins remain one of the greatest mysteries in science. Unlike biological fossils, language leaves no physical trace. However, by studying the structure of modern languages, the behavior of primates, and the genetics of ancient hominids, researchers are starting to piece together how we became a speaking species.

One theory suggests that language evolved from manual gestures. Proponents of this "gestural theory" point to the mirror neuron system in the brain, which is active both when performing an action and when observing someone else do the same. This system, located in Broca’s area (the part of the brain responsible for speech), may have initially helped our ancestors coordinate through hand signals before vocalizations took over.

Others argue for a "vocal-first" approach. They believe that early humans used a proto-language consisting of complex calls and emotional vocalizations, similar to those seen in modern apes but much more nuanced. As the human larynx descended and brain capacity increased, these sounds became more structured, eventually developing into the symbolic communication we use today.

The discovery of the FOXP2 gene in 1990 further complicated the debate. Often called the "language gene," FOXP2 is essential for the fine motor control of the mouth and tongue required for speech. Mutations in this gene leads to severe speech and language disorders. While FOXP2 exists in many animals, the human version has two specific amino acid changes that appeared around 200,000 years ago, coinciding with the emergence of anatomically modern humans.`,
      questions: [
        {
          id: 'rq7',
          type: 'multiple-choice',
          groupTitle: 'Questions 7-10: Sentence Completion',
          question: 'What lack of evidence makes language origin hard to study?',
          options: ['Genetic data', 'Physical fossils', 'Primate comparisons', 'Brain scans'],
          correctAnswer: 'Physical fossils',
          explanation: 'The text says: "Unlike biological fossils, language leaves no physical trace."'
        },
        {
          id: 'rq8',
          type: 'fill-blank',
          question: 'The _______ neuron system in the brain is key to the gestural theory.',
          correctAnswer: 'mirror',
          explanation: 'The passage mentions the "mirror neuron system" in the context of the gestural theory.'
        },
        {
          id: 'rq9',
          type: 'dropdown',
          question: 'Broca’s area is primarily responsible for _______',
          options: ['Hearing', 'Speech', 'Visual processing', 'Memory'],
          correctAnswer: 'Speech',
          explanation: 'The text describes Broca’s area as "the part of the brain responsible for speech."'
        },
        {
          id: 'rq10',
          type: 'multiple-choice',
          question: 'When did the human version of FOXP2 appear?',
          options: ['1 million years ago', '500,000 years ago', '200,000 years ago', '10,000 years ago'],
          correctAnswer: '200,000 years ago',
          explanation: 'The text says the changes "appeared around 200,000 years ago."'
        }
      ]
    }
  ]
};

export const mockIELTSListening: ExamData = {
  id: 'ielts-listening-1',
  type: 'IELTS',
  skill: 'Listening',
  title: 'IELTS Listening: Practice Test 1',
  duration: 1800,
  sections: [
    {
      id: 'l-sec-1',
      title: 'Part 1: Inquiry about a Holiday Rental',
      audioUrl: 'https://ais-pre-f4ixx4nrgjg5ajven2aphu-699853392393.asia-southeast1.run.app/assets/mock-audio-ielts-1.mp3',
      questions: [
        {
          id: 'lq1',
          type: 'fill-blank',
          groupTitle: 'Questions 1-4: Form Completion',
          question: 'Name: Sarah _______',
          correctAnswer: 'PETERSON',
          explanation: 'The speaker spells her name: P-E-T-E-R-S-O-N.'
        },
        {
          id: 'lq2',
          type: 'fill-blank',
          question: 'Arrival Date: _______ 14th',
          correctAnswer: 'July',
          explanation: 'She mentions arriving on July the 14th.'
        },
        {
          id: 'lq3',
          type: 'multiple-choice',
          question: 'Number of people in the group:',
          options: ['2', '4', '5', '6'],
          correctAnswer: '5',
          explanation: 'She says: "There will be five of us in total—myself, my husband, and our three children."'
        },
        {
          id: 'lq4',
          type: 'dropdown',
          question: 'Needs a high chair for the _______',
          options: ['Infant', 'Toddler', 'Kitchen', 'Living room'],
          correctAnswer: 'Toddler',
          explanation: 'She mentions: "We also need a high chair for the toddler."'
        }
      ]
    },
    {
      id: 'l-sec-2',
      title: 'Part 2: Community Library Improvements',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      questions: [
        {
          id: 'lq5',
          type: 'multiple-choice',
          groupTitle: 'Questions 5-7: Multiple Choice',
          question: 'What is the main reason for the library renovation?',
          options: ['To add more books', 'To replace the roof', 'To attract more young visitors', 'To build a coffee shop'],
          correctAnswer: 'To attract more young visitors',
          explanation: 'The speaker says the aim is to modernize and bring in a younger demographic.'
        },
        {
          id: 'lq6',
          type: 'multiple-choice',
          question: 'Where is the new digital zone located?',
          options: ['Next to the entrance', 'In the basement', 'In the quiet study area', 'On the first floor'],
          correctAnswer: 'Next to the entrance',
          explanation: 'The guide says: "As you enter, you will see our new digital zone immediately on your right."'
        },
        {
          id: 'lq7',
          type: 'matching',
          groupTitle: 'Questions 8-10: Labelling a Map',
          question: 'Match the facility with its key location:',
          options: ['Fiction Section', 'Childrens Corner', 'Cafeteria'],
          correctAnswer: ['Zone A', 'Lower Deck', 'Roof Terrace'],
          explanation: 'Refer to the speaker\'s directions on the floor plan.'
        }
      ]
    }
  ]
};

export const mockIELTSWriting: ExamData = {
  id: 'ielts-writing-1',
  type: 'IELTS',
  skill: 'Writing',
  title: 'IELTS Academic Writing: Practice Test 1',
  duration: 3600,
  sections: [
    {
      id: 'w-sec-1',
      title: 'Task 1: Academic Graph Description',
      content: 'The graph below shows the changes in global population by region between 1950 and 2050 (projected).\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      questions: [
        {
          id: 'wq1',
          type: 'writing',
          question: 'Summarize the population trends based on the provided prompt.',
          correctAnswer: '',
          explanation: 'A strong Task 1 response should have a clear introduction, an overview of the main trends, and two paragraphs comparing specific details (e.g., Africa vs Asia growth).'
        }
      ]
    },
    {
      id: 'w-sec-2',
      title: 'Task 2: Opinion Essay',
      content: 'Some people think that it is best to work in the same organization for one\'s whole life. Others think that it is better to change jobs frequently.\n\nDiscuss both views and give your opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      questions: [
        {
          id: 'wq2',
          type: 'writing',
          question: 'Discuss both views on career stability vs change and provide your opinion.',
          correctAnswer: '',
          explanation: 'A strong essay for Task 2 should have a clear structure: Introduction (rephrasing and thesis), Body Paragraph 1 (Stability), Body Paragraph 2 (Change), and a Conclusion with a firm opinion.'
        }
      ]
    }
  ]
};
