import figlet from "figlet";
import gradient from "gradient-string";

export function showBanner() {
  const text = figlet.textSync("NebulaX", {
    horizontalLayout: "full",
  });

  // Use built-in gradients: "retro", "atlas", "pastel", "morning", etc.
  const colored = gradient.pastel.multiline(text);

  console.log(colored);
}
