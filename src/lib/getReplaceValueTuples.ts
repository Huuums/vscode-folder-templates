import * as vscode from "vscode";
import { StringReplaceTuple } from "../types";

export default (variableNames: string[]) => {
  return variableNames.reduce(
    async (acc: Promise<StringReplaceTuple[]>, variableName) => {
      const prevAcc = await acc;
      let prompt = `Enter Replace value to replace custom variable <${variableName}>`;
      let value;
      const [name, defaultValue] = variableName
        .split("=>")
        .map((val) => val.trim());

      if (name === "FTName") {
        prompt = `Enter the name of your new component`;
      }
      if (defaultValue) {
        value = defaultValue;
      }
      const inputValue = await vscode.window.showInputBox({
        prompt,
        value,
      });
      //always return a string
      return prevAcc.concat([[name, inputValue || ""]]);
    },
    Promise.resolve([])
  );
};
