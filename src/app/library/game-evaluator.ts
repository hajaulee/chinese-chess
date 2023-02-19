export interface GameEvaluator<T> {
  evaluate: (game: T) => number;
  isTerminate: (game: T) => boolean;
}
