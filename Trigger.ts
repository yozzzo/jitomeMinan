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

const doPost=(e: any) => {
  console.log("fooks成功")
  console.log(e)
  const line = new Line();
  const main = new Main(line);

  main.doPost(e, line);
}
