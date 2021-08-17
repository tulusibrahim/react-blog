import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from './src/components/App'

// it("renders correctly", () => {
//     const { queryByTestId } = render(<App />)

//     expect(queryByTestId("test")).toBeTruthy()
// })

test('test app'), () => {
    expect(<App />).toBeTruthy()
}