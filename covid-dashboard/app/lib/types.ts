/** State information
 * @param abbrev State's abbreviation
 * @param data Array of datums, storing data values for state
 * @param selectedMetrics Currently selected metrics
 * @param nullMetrics Map of metrics that are all null
 */
export interface State {
  id?: number; //unique
  abbrev: string;
  data?: datum[]; // array of state's data from csv
  selectedMetrics?: Map<keyof datum, string>; // mep of selected metrics to pretty metrics pairs
  nullMetrics?: nullMetrics; // property is true if all of that metric's values is Null, false otherwise
}

/** Map of metrics to displayable */
export const metricsMap = new Map<keyof datum, string>([
  ["death", "Deaths"],
  ["deathConfirmed", "Confirmed Deaths"],
  ["deathIncrease", "Increased Deaths"],
  ["deathProbable", "Probable Deaths"],
  ["hospitalized", "Hospitalizations"],
  ["hospitalizedCumulative", "Cumulative Hospitalizations"],
  ["hospitalizedCurrently", "Currently Hospitalized"],
  ["hospitalizedIncrease", "Increase Hospitalizations"],
  ["inIcuCumulative", "Cumulative in ICU"],
  ["inIcuCurrently", "Currently in ICU "],
  ["negative", "Negatives"],
  ["negativeIncrease", "Increase Negatives"],
  ["negativeTestsAntibody", "Negative Antibody Tests"],
  ["negativeTestsPeopleAntibody", "Negative Antibody Tests People"],
  ["negativeTestsViral", "Negative Viral Tests"],
  ["onVentilatorCumulative", "Cumulativly on Ventilator"],
  ["onVentilatorCurrently", "Currently on Ventilator"],
  ["positive", "Positive"],
  ["positiveCasesViral", "Positive Viral Cases"],
  ["positiveIncrease", "Positive Increase"],
  ["positiveScore", "Positive Score"],
  ["positiveTestsAntibody", "Positive Tests Antibody"],
  ["positiveTestsAntigen", "Positive Antigen Tests"],
  ["positiveTestsPeopleAntibody", "Positive Antibody Tests People"],
  ["positiveTestsPeopleAntigen", "Positive Antigen Tests Peopel"],
  ["positiveTestsViral", "Positive Viral Tests"],
  ["recovered", "Recovered"],
  ["totalTestEncountersViral", "Total Viral Test Encounters"],
  ["totalTestEncountersViralIncrease", "Total Viral Test Encounters Increase"],
  ["totalTestResults", "Total Test Results"],
  ["totalTestResultsIncrease", "Total Test Results Increase"],
  ["totalTestsAntibody", "Total Antibody Tests"],
  ["totalTestsAntigen", "Total Antigen Tests"],
  ["totalTestsPeopleAntibody", "Total Antibody Tests People "],
  ["totalTestsPeopleAntigen", "Total Antigen Tests People"],
  ["totalTestsPeopleViral", "Total Viral Tests People "],
  ["totalTestsPeopleViralIncrease", "Total Increase Viral Tests People"],
  ["totalTestsViral", "Total Viral Tests"],
  ["totalTestsViralIncrease", "Total Increase Viral Tests"],
]);

/** Map of state's abbreviations to displayable state's full name */
export const abbrevMap = new Map<string, string>([
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
]);

/** Singular covid data point for a state on a given data */
export interface datum {
  date: string;
  state: string;
  death: number | null;
  deathConfirmed: number | null;
  deathIncrease: number | null;
  deathProbable: number | null;
  hospitalized: number | null;
  hospitalizedCumulative: number | null;
  hospitalizedCurrently: number | null;
  hospitalizedIncrease: number | null;
  inIcuCumulative: number | null;
  inIcuCurrently: number | null;
  negative: number | null;
  negativeIncrease: number | null;
  negativeTestsAntibody: number | null;
  negativeTestsPeopleAntibody: number | null;
  negativeTestsViral: number | null;
  onVentilatorCumulative: number | null;
  onVentilatorCurrently: number | null;
  positive: number | null;
  positiveCasesViral: number | null;
  positiveIncrease: number | null;
  positiveScore: number | null;
  positiveTestsAntibody: number | null;
  positiveTestsAntigen: number | null;
  positiveTestsPeopleAntibody: number | null;
  positiveTestsPeopleAntigen: number | null;
  positiveTestsViral: number | null;
  recovered: number | null;
  totalTestEncountersViral: number | null;
  totalTestEncountersViralIncrease: number | null;
  totalTestResults: number | null;
  totalTestResultsIncrease: number | null;
  totalTestsAntibody: number | null;
  totalTestsAntigen: number | null;
  totalTestsPeopleAntibody: number | null;
  totalTestsPeopleAntigen: number | null;
  totalTestsPeopleViral: number | null;
  totalTestsPeopleViralIncrease: number | null;
  totalTestsViral: number | null;
  totalTestsViralIncrease: number | null;
}

/** Are all values null for a given metric? */
export interface nullMetrics {
  death: boolean;
  deathConfirmed: boolean;
  deathIncrease: boolean;
  deathProbable: boolean;
  hospitalized: boolean;
  hospitalizedCumulative: boolean;
  hospitalizedCurrently: boolean;
  hospitalizedIncrease: boolean;
  inIcuCumulative: boolean;
  inIcuCurrently: boolean;
  negative: boolean;
  negativeIncrease: boolean;
  negativeTestsAntibody: boolean;
  negativeTestsPeopleAntibody: boolean;
  negativeTestsViral: boolean;
  onVentilatorCumulative: boolean;
  onVentilatorCurrently: boolean;
  positive: boolean;
  positiveCasesViral: boolean;
  positiveIncrease: boolean;
  positiveScore: boolean;
  positiveTestsAntibody: boolean;
  positiveTestsAntigen: boolean;
  positiveTestsPeopleAntibody: boolean;
  positiveTestsPeopleAntigen: boolean;
  positiveTestsViral: boolean;
  recovered: boolean;
  totalTestEncountersViral: boolean;
  totalTestEncountersViralIncrease: boolean;
  totalTestResults: boolean;
  totalTestResultsIncrease: boolean;
  totalTestsAntibody: boolean;
  totalTestsAntigen: boolean;
  totalTestsPeopleAntibody: boolean;
  totalTestsPeopleAntigen: boolean;
  totalTestsPeopleViral: boolean;
  totalTestsPeopleViralIncrease: boolean;
  totalTestsViral: boolean;
  totalTestsViralIncrease: boolean;
}

/** null metrics base case, to be set to true on finding a non null metric */
export const negativeNullMetrics: nullMetrics = {
  death: false,
  deathConfirmed: false,
  deathIncrease: false,
  deathProbable: false,
  hospitalized: false,
  hospitalizedCumulative: false,
  hospitalizedCurrently: false,
  hospitalizedIncrease: false,
  inIcuCumulative: false,
  inIcuCurrently: false,
  negative: false,
  negativeIncrease: false,
  negativeTestsAntibody: false,
  negativeTestsPeopleAntibody: false,
  negativeTestsViral: false,
  onVentilatorCumulative: false,
  onVentilatorCurrently: false,
  positive: false,
  positiveCasesViral: false,
  positiveIncrease: false,
  positiveScore: false,
  positiveTestsAntibody: false,
  positiveTestsAntigen: false,
  positiveTestsPeopleAntibody: false,
  positiveTestsPeopleAntigen: false,
  positiveTestsViral: false,
  recovered: false,
  totalTestEncountersViral: false,
  totalTestEncountersViralIncrease: false,
  totalTestResults: false,
  totalTestResultsIncrease: false,
  totalTestsAntibody: false,
  totalTestsAntigen: false,
  totalTestsPeopleAntibody: false,
  totalTestsPeopleAntigen: false,
  totalTestsPeopleViral: false,
  totalTestsPeopleViralIncrease: false,
  totalTestsViral: false,
  totalTestsViralIncrease: false,
};