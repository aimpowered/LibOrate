import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { NameTagForm } from "@/components/NameTagForm";

const currentNameTag = {
  visible: false,
  preferredName: "Test User",
  pronouns: "",
  disclosure: "",
};
const updateNameTagContent = jest.fn();

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));
jest.mock("../lib/zoomapi", () => jest.requireActual("../lib/fakezoomapi"));

describe("NameTagForm", () => {
  it("renders the heading and input fields", () => {
    render(
      <NameTagForm
        content={currentNameTag}
        onNameTagContentChange={updateNameTagContent}
      />,
    );
    expect(screen.getByText("Preferred Name")).toBeInTheDocument();
    expect(screen.getAllByText("Pronouns")[0]).toBeInTheDocument();
    expect(screen.getByText("Something About Me")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Save Name Tag")).toBeInTheDocument();
  });

  it("verifies that the nametag display checkbox can be checked", async () => {
    render(
      <NameTagForm
        content={currentNameTag}
        onNameTagContentChange={updateNameTagContent}
      />,
    );

    const element = screen.getByLabelText("Display Name Tag");
    expect(element).toBeInTheDocument();

    let checkboxInput = screen.getByRole("checkbox");

    expect(checkboxInput).toBe(element);

    expect(checkboxInput).not.toBeChecked();
    expect(currentNameTag.visible).toBe(false);
    await userEvent.click(checkboxInput);
    expect(checkboxInput).toBeChecked();
    //expect(currentNameTag.visible).toBe(true);
    await waitFor(() => {
      expect(updateNameTagContent).toHaveBeenCalled();
      expect(updateNameTagContent.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          visible: true,
          preferredName: expect.anything(),
          pronouns: expect.anything(),
          disclosure: expect.anything(),
        }),
      );
    });
  });

  it("checks that self disclosure character length limit is working", async () => {
    render(
      <NameTagForm
        content={currentNameTag}
        onNameTagContentChange={updateNameTagContent}
      />,
    );

    const disclosureField = screen.getByDisplayValue("I have a stutter");

    expect(
      screen.queryByDisplayValue((content) =>
        content.includes("Exceeded length limit!"),
      ),
    ).toBeNull();
    await userEvent.type(
      disclosureField,
      "message that is too long to fit in the disclosure field because the field has a 30 character limit",
    );
    expect(
      screen.getByText((content) => content.includes("Exceeded length limit!")),
    ).toBeInTheDocument();
  });
});
