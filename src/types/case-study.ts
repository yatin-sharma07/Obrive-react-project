export interface CaseStudyContentData {
  challenge: {
    content: string;
  };
  strategicApproach: {
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  companyOverview: {
    content: string;
    quote?: string;
  };
  whyItWorked: {
    items: Array<{
      title: string;
      description: string;
    }>;
    finalQuote?: string;
  };
  outcomeSnapshot: {
    quote: string;
    author: string;
    closingStatement: string;
  };
}
