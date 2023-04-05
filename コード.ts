import { Line } from "./Line";
import { Main } from "./Main";

const beginningWeeklyRemind = () => {
  const line = new Line();
  const main = new Main(line);

  main.beginningWeeklyRemind();
};

const endOfWeeklyRemind = () => {
  const line = new Line();
  const main = new Main(line);

  main.endOfWeeklyRemind();
};