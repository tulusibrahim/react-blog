import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Tags from "./taglist";
import { BrowserRouter as Router } from "react-router-dom";

it("render list of tags", async () => {
  render(
    <Router>
      <Tags />
    </Router>
  );
  let text = await screen.findByText(/(react)/i);
  expect(text).toBeVisible();
});

it("redirect to another page when clicked", async () => {
  render(
    <Router>
      <Tags />
    </Router>
  );
  let text = await screen.findByText(/(react)/i);
  text.click();
  expect(window.location.href).toEqual("http://localhost/topic/react");
});
