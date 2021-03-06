import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { EditDiverForm } from "../EditDiverForm";

describe("Edit diver form tests", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <MockedProvider>
        <EditDiverForm
          setEditingForm={() => jest.fn()}
          closeModal={() => jest.fn()}
          sendFormData={() => jest.fn()}
        />
      </MockedProvider>
    );
  });
});
