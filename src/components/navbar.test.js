import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./navbar";
import { BrowserRouter as Router } from "react-router-dom";

const renderNavbar = () =>
  render(
    <Router>
      <Navbar />
    </Router>
  );

test("make sure navbar render, visible", () => {
  let { getByText } = renderNavbar();
  expect(getByText("Write")).toBeInTheDocument();
  expect(getByText("Write")).toBeVisible();
});

test("make sure profile image render, visible", () => {
  let { getByRole } = renderNavbar();
  expect(getByRole("button")).toBeInTheDocument();
  expect(getByRole("button")).toBeVisible();
});

test("make sure option is visible when click profile image", async () => {
  renderNavbar();
  let btn = screen.getByTestId("profileimage");
  fireEvent.click(btn);
  let option = screen.getByText("Log in");
  await waitFor(() => {
    expect(option).toBeVisible();
  });
});

test("make sure redirect to login page after click login option", () => {
  renderNavbar();
  let btn = screen.getByTestId("profileimage");
  fireEvent.click(btn);
  let option = screen.getByText("Log in");
  fireEvent.click(option);
  expect(window.location.href).toEqual("http://localhost/login");
});

test("make sure redirect to about page", () => {
  renderNavbar();
  let btn = screen.getByTestId("profileimage");
  fireEvent.click(btn);
  let aboutBtn = screen.getByText("About us");
  fireEvent.click(aboutBtn);
  expect(window.location.href).toEqual("http://localhost/about");
});
