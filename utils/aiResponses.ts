// AI response generator for different team members
export const generateAIResponse = (
  memberId: string,
  memberName: string,
  userMessage: string
): string => {
  const responses: Record<string, string[]> = {
    'tech-lead': [
      `As Technical Lead, I've analyzed your request: "${userMessage}". From an architectural perspective, I recommend implementing a scalable solution with proper separation of concerns. Let's prioritize maintainability and consider using microservices if the complexity warrants it.`,
      `Looking at "${userMessage}" from a technical leadership standpoint, we should establish clear API contracts and ensure our error handling is robust. I suggest we create a technical spec document first.`,
      `For "${userMessage}", I'd approach this with a focus on system reliability. Let's implement comprehensive monitoring and set up proper logging from day one.`,
      `As your Technical Lead, I recommend treating "${userMessage}" as an opportunity to improve our code quality standards. Let's add unit tests and consider implementing CI/CD pipelines.`,
    ],
    'designer': [
      `From a UX perspective on "${userMessage}", I suggest we focus on user journey mapping first. Let's create user personas and identify pain points before jumping to solutions.`,
      `For "${userMessage}", I'm thinking about accessibility and inclusive design. We should ensure WCAG 2.1 compliance and test with various user scenarios.`,
      `As a Product Designer, I see "${userMessage}" as a chance to improve the visual hierarchy. Let's create wireframes and consider the emotional impact of our design choices.`,
      `Regarding "${userMessage}", I recommend conducting user research sessions. We need to validate our assumptions before committing to a specific design direction.`,
    ],
    'frontend': [
      `For "${userMessage}" from a frontend perspective, I'd implement this using React hooks for state management. We should consider using Tailwind for responsive design and optimize for Core Web Vitals.`,
      `As a Frontend Developer, I suggest breaking "${userMessage}" into reusable components. Let's implement proper TypeScript interfaces and consider using React.memo for performance optimization.`,
      `Looking at "${userMessage}", I recommend using a state management library if the complexity grows. We should also implement proper loading states and error boundaries.`,
      `For "${userMessage}", I'd focus on creating a smooth user experience with animations and transitions. Let's ensure our bundle size stays optimized and implement code splitting.`,
    ],
    'backend': [
      `From a backend standpoint on "${userMessage}", I recommend designing RESTful APIs with proper versioning. We should implement rate limiting and consider database indexing strategies.`,
      `For "${userMessage}", I suggest using a message queue for async processing. We need to implement proper authentication/authorization and consider data encryption at rest.`,
      `As a Backend Developer, I'd approach "${userMessage}" with security in mind. Let's implement input validation, SQL injection prevention, and proper error logging.`,
      `Regarding "${userMessage}", I recommend using caching strategies to improve performance. We should design for horizontal scalability and implement proper database migrations.`,
    ],
    'pm': [
      `As Product Manager looking at "${userMessage}", I recommend we validate this against our product roadmap. Let's define success metrics and establish a clear MVP scope first.`,
      `For "${userMessage}", I suggest we conduct market research and competitive analysis. We need to align this feature with our business objectives and user needs.`,
      `From a product strategy perspective on "${userMessage}", let's create user stories and prioritize based on impact vs. effort. We should also consider the technical debt implications.`,
      `Regarding "${userMessage}", I recommend we set up A/B testing to measure impact. Let's define clear KPIs and establish a feedback loop with our users.`,
    ],
  };

  const memberResponses = responses[memberId] || [
    `As ${memberName}, I understand your request about "${userMessage}". Let me provide some insights based on my expertise.`
  ];

  // Get a random response for variety
  return memberResponses[Math.floor(Math.random() * memberResponses.length)];
};

// Get a thoughtful follow-up question based on the member
export const getFollowUpQuestion = (memberId: string): string => {
  const questions: Record<string, string[]> = {
    'tech-lead': [
      'Would you like me to elaborate on the technical architecture?',
      'Should we consider any specific performance requirements?',
      'Do you have concerns about scalability for this approach?',
    ],
    'designer': [
      'Would you like to see some design mockups for this?',
      'Should we conduct user testing for this feature?',
      'Do you have any specific branding guidelines to follow?',
    ],
    'frontend': [
      'Would you like me to show some code examples?',
      'Should we consider mobile responsiveness for this?',
      'Do you have any accessibility requirements?',
    ],
    'backend': [
      'Would you like me to detail the API specifications?',
      'Should we consider database sharding for this?',
      'Do you have any security compliance requirements?',
    ],
    'pm': [
      'Would you like to see the ROI analysis for this?',
      'Should we create a product requirements document?',
      'Do you have a timeline in mind for this feature?',
    ],
  };

  const memberQuestions = questions[memberId] || [
    'Would you like me to provide more details?'
  ];

  return memberQuestions[Math.floor(Math.random() * memberQuestions.length)];
};
