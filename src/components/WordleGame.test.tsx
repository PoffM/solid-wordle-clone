import { render, screen, fireEvent, waitFor } from "solid-testing-library";
import { WordleGame } from "./WordleGame";

describe("WordleGame component", () => {
  it("Renders the initial blank state.", () => {
    render(() => <WordleGame solution="HELLO" />);
    const letterRows = screen.getAllByTestId("letter-grid-row");
    const letterBoxes = screen.getAllByTestId("letter-box");

    // Renders all letter rows and boxes:
    expect(letterRows.length).toEqual(6);
    expect(letterBoxes.length).toEqual(30);

    // All letter boxes are blank:
    expect(letterBoxes.filter((node) => node.innerText)).toEqual([]);
  });

  it("Plays through a game where you win.", async () => {
    const { baseElement } = render(() => <WordleGame solution="HELLO" />);

    // Guess #1 with all wrong letters:
    {
      for (const key of ["a", "m", "i", "s", "s", "Enter"]) {
        fireEvent.keyDown(baseElement, { key });
      }
      const firstRowBoxes = screen.getAllByTestId("letter-box").slice(0, 5);

      // The guess is rendered in the first row:
      expect(firstRowBoxes.map((node) => node.textContent?.[0])).toEqual([
        "A",
        "M",
        "I",
        "S",
        "S",
      ]);

      // All boxes should have the gray "usedLetter" color:
      expect(
        firstRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "bg-gray-500 dark:bg-gray-600",
        "bg-gray-500 dark:bg-gray-600",
        "bg-gray-500 dark:bg-gray-600",
        "bg-gray-500 dark:bg-gray-600",
        "bg-gray-500 dark:bg-gray-600",
      ]);
    }

    // Guess #2 with a mix of correct and misplaced letters:
    {
      // Guess "OLLIE" because it has a mix of different results:
      for (const key of ["o", "l", "l", "i", "e", "Enter"]) {
        fireEvent.keyDown(baseElement, { key });
      }
      const secondRowBoxes = screen.getAllByTestId("letter-box").slice(5, 10);

      // The guess is rendered in the second row:
      expect(secondRowBoxes.map((node) => node.textContent?.[0])).toEqual([
        "O",
        "L",
        "L",
        "I",
        "E",
      ]);

      // The correct letter box colors are shown:
      expect(
        secondRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "bg-yellow-500", // O: misplaced
        "bg-yellow-500", // First L: misplaced
        "bg-green-500", // Second L: correct spot
        "bg-gray-500 dark:bg-gray-600", // I: Not in the solution
        "bg-yellow-500", // E: misplaced
      ]);

      // The keyboard buttons are colored correctly:
      expect(screen.getByRole("button", { name: "O" }).className).toContain(
        "bg-yellow-500"
      );
      expect(screen.getByRole("button", { name: "L" }).className).toContain(
        "bg-green-500"
      );
      expect(screen.getByRole("button", { name: "I" }).className).toContain(
        "bg-gray-500 dark:bg-gray-700"
      );
      expect(screen.getByRole("button", { name: "E" }).className).toContain(
        "bg-yellow-500"
      );
    }

    // Guess #3 with the correct word:
    {
      // // Enter the solution:
      for (const key of ["h", "e", "l", "l", "o", "Enter"]) {
        fireEvent.keyDown(baseElement, { key });
      }
      const thirdRowBoxes = screen.getAllByTestId("letter-box").slice(10, 15);

      // The letter boxes are all the correct green color:
      expect(
        thirdRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "bg-green-500",
        "bg-green-500",
        "bg-green-500",
        "bg-green-500",
        "bg-green-500",
      ]);
    }

    // Post-win UI:
    {
      // The win text is shown:
      expect(screen.getByText("WINNER!")).toBeTruthy();

      // Click the restart button:
      screen.getByRole("button", { name: "Next Word" }).click();
      const letterBoxes = screen.getAllByTestId("letter-box");

      // All the boxes are blank again:
      expect(letterBoxes.filter((node) => node.innerText)).toEqual([]);
    }
  });

  it("Plays through a game where you lose", async () => {
    const { baseElement } = render(() => <WordleGame solution="HELLO" />);

    // Guess with all wrong letters 6 times:
    for (let i = 1; i <= 6; i++) {
      for (const key of ["a", "m", "i", "s", "s", "Enter"]) {
        fireEvent.keyDown(baseElement, { key });
      }
    }

    // Post-lose UI:
    {
      // The solution text is shown:
      expect(screen.getByText("SOLUTION")).toBeTruthy();
      expect(screen.getByText("HELLO")).toBeTruthy();

      // Click the restart button:
      screen.getByRole("button", { name: "Next Word" }).click();
      const letterBoxes = screen.getAllByTestId("letter-box");

      // All the boxes are blank again:
      expect(letterBoxes.filter((node) => node.innerText)).toEqual([]);
    }
  });

  it("Enters the text using the clickable keyboard UI", async () => {
    render(() => <WordleGame solution="HELLO" />);

    // Guess "OLLIE" because it has a mix of different results:
    screen.getByRole("button", { name: "O" }).click();
    screen.getByRole("button", { name: "L" }).click();
    screen.getByRole("button", { name: "L" }).click();
    screen.getByRole("button", { name: "I" }).click();
    screen.getByRole("button", { name: "E" }).click();
    screen.getByRole("button", { name: /enter/i }).click();

    const firstRowBoxes = screen.getAllByTestId("letter-box").slice(0, 5);

    // The guess is rendered in the second row:
    expect(firstRowBoxes.map((node) => node.textContent?.[0])).toEqual([
      "O",
      "L",
      "L",
      "I",
      "E",
    ]);

    // The correct letter box colors are shown:
    await waitFor(() => {
      expect(
        firstRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "bg-yellow-500", // O: misplaced
        "bg-yellow-500", // First L: misplaced
        "bg-green-500", // Second L: correct spot
        "bg-gray-500 dark:bg-gray-600", // I: Not in the solution
        "bg-yellow-500", // E: misplaced
      ]);
    });
  });

  it("Shows a toast message when you enter an unknown word", async () => {
    const { baseElement } = render(() => <WordleGame solution="HELLO" />);

    for (const key of ["a", "s", "d", "f", "g", "Enter"]) {
      fireEvent.keyDown(baseElement, { key });
    }

    expect(screen.getByText("Word not in word list.")).toBeTruthy();
  });

  it("Shows a toast message when you enter a word that's too short", async () => {
    const { baseElement } = render(() => <WordleGame solution="HELLO" />);

    for (const key of ["r", "e", "d", "Enter"]) {
      fireEvent.keyDown(baseElement, { key });
    }

    expect(screen.getByText("Not enough letters.")).toBeTruthy();
  });

  it("Lets you remove a letter by pressing backspace", async () => {
    const { baseElement } = render(() => <WordleGame solution="HELLO" />);

    for (const key of ["r", "e", "d", "Backspace"]) {
      fireEvent.keyDown(baseElement, { key });
    }

    // The guess is rendered in the first row:
    const firstRowBoxes = screen.getAllByTestId("letter-box").slice(0, 3);
    expect(firstRowBoxes.map((node) => node.textContent?.[0])).toEqual([
      "R",
      "E",
      undefined,
    ]);
  });

});
