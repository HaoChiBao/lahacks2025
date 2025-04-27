export interface FillSnippet {
    code: string;
    options: string[];
    description: string;
  }
  
  export interface FillSnippetsByDifficulty {
    [difficulty: string]: FillSnippet[];
  }
  
  export const fillSnippets: FillSnippetsByDifficulty = {
    beginner: [
      {
        code: `
  <option: 1> countUp(limit: number) {
      let i = 0;
      while (<option: 2>) {
          <option: 3> i;
          i++;
      }
  }
  
  const <option: 4> = countUp(3);
  
  console.log(iterator.<option: 5>().<option: 6>); // Output: 0
  console.log(iterator.next().value); // Output: 1
  console.log(iterator.next().value); // Output: 2
  console.log(iterator.next().done);  // Output: true
  `,
        options: ["function*", "i < limit", "yield", "iterator", "next", "value"],
        description:
          "Creates a generator function 'countUp' that yields numbers sequentially from 0 up to (but not including) a specified limit.",
      },
    ],
    intermediate: [
      {
        code: `
  interface Configuration {
      apiUrl: string;
      timeout: number;
      retries: number;
      featureFlags: { [key: string]: boolean };
  }
  
  // Create a type where all properties of T are optional
  <option: 1> MakeOptional<<option: 2>> = {
      [P in <option: 3> SourceType]<option: 4>: SourceType[P];
  };
  
  // Usage: PartialConfig can have some, all, or none of Configuration's properties
  const partialSettings: <option: 5><Configuration> = {
      timeout: 5000
  };
  
  function applyConfiguration(config: MakeOptional<<option: 6>>) {
      console.log("Applying config:", config);
  }
  
  applyConfiguration(partialSettings);
  `,
        options: ["type", "SourceType", "keyof", "?", "MakeOptional", "Configuration"],
        description:
          "Defines a generic mapped type 'MakeOptional' that takes an interface 'SourceType' and creates a new type where all properties are optional.",
      },
    ],
    advanced: [
      // Currently no advanced examples provided, but you can add them here later
    ],
  };
  