export type MetricColor = 'pink' | 'cyan' | 'gold' | 'emerald' | 'purple';

export interface Metric {
  id: string;
  title: string;
  subtitle: string;
  current: number;
  target: number;
  remainingLabel: string;
  color: MetricColor;
  stepSizes: number[];
}

export interface ScheduleDay {
  day: string;
  focus: string;
  tasks: string[];
}

export type GoalRange = 'Today' | 'Week 1' | 'Week 2' | 'Month 1' | 'Long Term';
export type GoalStatus = 'Pending' | 'In Progress' | 'Achieved';

export interface Goal {
  id: string;
  title: string;
  range: GoalRange;
  status: GoalStatus;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Rule {
  id: string;
  text: string;
}

export interface Benchmark {
  id: string;
  text: string;
}

export interface AppState {
  brandTitle: string;
  brandBadge: string;
  brandSub: string;
  quoteBadge: string;
  mainQuote: string;
  timerLabel: string;
  targetDate: string;
  calSectionTitle: string;
  calSectionSub: string;
  goalsTitle: string;
  todoTitle: string;
  rulesTitle: string;
  benchmarksTitle: string;
  soundEnabled: boolean;
  metrics: Metric[];
  schedule: ScheduleDay[];
  goals: Goal[];
  todos: TodoItem[];
  rules: Rule[];
  benchmarks: Benchmark[];
}
