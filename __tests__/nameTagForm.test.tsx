import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { NameTagForm } from "@/components/NameTagForm";

const emptyNameTag = Object.freeze({
  visible: false,
  preferredName: "Test User",
  pronouns: "",
  disclosure: "",
});

describe("NameTagForm", () => {
  it("renders the heading and input fields", () => {
    render(
      <NameTagForm
        content={emptyNameTag}
        onNameTagContentChange={() => {}}
        onSaveButtonClick={() => {}}
      />,
    );
    expect(screen.getByText("Preferred Name")).toBeInTheDocument();
    expect(screen.getAllByText("Pronouns")[0]).toBeInTheDocument();
    expect(screen.getByText("Something About Me")).toBeInTheDocument();
    expect(screen.getAllByRole("switch")).toHaveLength(2);
    expect(screen.getByText("Save Name Tag")).toBeInTheDocument();
  });

  it("verifies that the nametag display checkbox can be checked", async () => {
    const updateNameTagContent = jest.fn();
    await act(async () => {
      render(
        <NameTagForm
          content={emptyNameTag}
          onNameTagContentChange={updateNameTagContent}
          onSaveButtonClick={() => {}}
        />,
      );
    });

    const displayNameTag = screen.getByLabelText("Display Name Tag");
    expect(displayNameTag).toBeInTheDocument();

    const checkboxInputs = screen.getAllByRole("switch");
    const isSameCheckboxFound = checkboxInputs.some(
      (checkbox) => checkbox === displayNameTag,
    );

    expect(isSameCheckboxFound).toBe(true);
    expect(displayNameTag).not.toBeChecked();

    await act(async () => {
      await userEvent.click(displayNameTag);
    });

    expect(displayNameTag).toBeChecked();
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
        content={{ ...emptyNameTag, disclosure: "I have a stutter" }}
        onNameTagContentChange={() => {}}
        onSaveButtonClick={() => {}}
      />,
    );

    const disclosureField = screen.getByDisplayValue("I have a stutter");

    expect(
      screen.queryByDisplayValue((content) =>
        content.includes("Exceeded length limit!"),
      ),
    ).toBeNull();
    await act(async () => {
      await userEvent.type(
        disclosureField,
        "message that is too long to fit in the disclosure field because the field has a 30 character limit",
      );
    });
    expect(
      screen.getByText((content) => content.includes("Exceeded length limit!")),
    ).toBeInTheDocument();
  });

  it("checks that the submit buton works", async () => {
    const saveButtonCallback = jest.fn();
    await act(async () => {
      render(
        <NameTagForm
          content={emptyNameTag}
          onNameTagContentChange={() => {}}
          onSaveButtonClick={saveButtonCallback}
        />,
      );
    });

    const submit = screen.getByText("Save Name Tag");

    await act(async () => {
      await userEvent.click(submit);
    });
    await waitFor(() => {
      expect(saveButtonCallback).toHaveBeenCalled();
    });
  });

  it("should capture full message and send self disclosure flag", async () => {
    const onSaveButtonClick = jest.fn();
    const onNameTagContentChange = jest.fn();

    const content = {
      preferredName: "Test User",
      pronouns: "They/Them",
      disclosure: "I love coding.",
      visible: false,
      fullMessage: "",
      sendToMeeting: false,
    };

    await act(async () => {
      render(
        <NameTagForm
          content={content}
          onSaveButtonClick={onSaveButtonClick}
          onNameTagContentChange={onNameTagContentChange}
        />,
      );
    });

    const fullMessageTextarea = screen.getByPlaceholderText(
      "Introduce yourself...",
    );
    const sendDisclosureToggle = screen.getByLabelText(
      "Send Disclosure Message",
    );
    const saveButton = screen.getByRole("button", {
      name: /save name tag/i,
    });

    await act(async () => {
      await userEvent.type(fullMessageTextarea, "Hello from test!");
      await userEvent.click(sendDisclosureToggle);
      await userEvent.click(saveButton);
    });

    expect(onNameTagContentChange).toHaveBeenCalledTimes(2);

    expect(onSaveButtonClick).toHaveBeenCalledWith(
      expect.objectContaining({
        fullMessage: "Hello from test!",
        sendToMeeting: true,
      }),
    );
  });
});
