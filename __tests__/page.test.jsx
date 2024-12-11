import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Favorites from "@/app/pages/favorites";
import UserGarden from "@/app/pages/garden";
import Projects from "@/app/pages/projects/[id]/page";
import { toast, ToastContainer } from "react-toastify";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

const mockRouter = {
  back: jest.fn(),
};

beforeEach(() => {
  useRouter.mockReturnValue(mockRouter);
  fetch.mockClear();
});

test("should display loading state while fetching favorites", () => {
  fetch.mockResolvedValueOnce({
    json: () => Promise.resolve([]),
  });

  render(<Favorites />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("should display favorites once data is fetched", async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve([
        {
          id: "1",
          projectId: "123",
          addedDate: "2024-12-10",
        },
      ]),
  });

  render(<Favorites />);

  await waitFor(() => screen.getByText("Unknown Project"));

  expect(screen.getByText("Unknown Project")).toBeInTheDocument();
  expect(screen.getByText("No favorites added.")).not.toBeInTheDocument();
});

test("should show error message when fetch fails", async () => {
  fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

  render(<Favorites />);

  await waitFor(() =>
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
  );

  expect(screen.getByText("Oops! Couldn't load favorites")).toBeInTheDocument();
});

test("should add a project to favorites", async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve([
        {
          id: "1",
          projectId: "123",
          addedDate: "2024-12-10",
        },
      ]),
  });

  render(<Projects />);

  await waitFor(() => screen.getByText("Add to Favorites"));

  fireEvent.click(screen.getByText("Add to Favorites"));

  expect(toast.success).toHaveBeenCalledWith("Project added to favorites!");
});

test("should handle delete favorite", async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve([
        {
          id: "1",
          projectId: "123",
          addedDate: "2024-12-10",
        },
      ]),
  });

  render(<Favorites />);

  await waitFor(() => screen.getByText("Unknown Project"));

  fireEvent.click(screen.getByText("Delete"));

  await waitFor(() => screen.queryByText("Unknown Project"));

  expect(toast.success).toHaveBeenCalledWith("Favorite deleted!");
});

test("should render user garden with correct user data", async () => {
  render(
    <UserGarden
      user={{ id: "1", name: "John", color: "green", projects: [{ id: "p1" }] }}
    />
  );

  expect(screen.getByText("John's Garden")).toBeInTheDocument();
  expect(screen.getByText("1 Plants")).toBeInTheDocument();
});

test("should navigate back when back button is clicked in projects page", () => {
  render(<Projects />);

  const backButton = screen.getByText("Back to Garden");
  fireEvent.click(backButton);

  expect(mockRouter.back).toHaveBeenCalled();
});

test("should display project details after fetching data", async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve({
        id: "123",
        name: "Project A",
        description: "Project A description",
      }),
  });

  render(<Projects />);

  await waitFor(() => screen.getByText("Project A"));

  expect(screen.getByText("Project A")).toBeInTheDocument();
  expect(screen.getByText("Project A description")).toBeInTheDocument();
});

test("should handle posting new update", async () => {
  render(<Projects />);

  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "Update Title" },
  });
  fireEvent.change(screen.getByPlaceholderText("Description"), {
    target: { value: "Update description" },
  });
  fireEvent.click(screen.getByText("Post Update"));

  expect(toast.success).toHaveBeenCalledWith("New update posted!");
});

test("should handle error when posting update with missing fields", () => {
  render(<Projects />);

  fireEvent.click(screen.getByText("Post Update"));

  expect(toast.error).toHaveBeenCalledWith(
    "Please provide all fields: title and description."
  );
});

test("should show error if add to favorites fails", async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve({
        id: "123",
        name: "Project A",
        description: "Project A description",
      }),
  });

  render(<Projects />);

  fireEvent.click(screen.getByText("Add to Favorites"));

  fetch.mockRejectedValueOnce(new Error("Failed to add favorite"));

  expect(toast.error).toHaveBeenCalledWith("Failed to add to favorites.");
});
