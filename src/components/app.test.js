import React from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent } from '@testing-library/react'
import App from './App'

// it("renders correctly", () => {
//     const { queryByTestId } = render(<App />)

//     expect(queryByTestId("test")).toBeTruthy()
// })

// test('test app', () => {
//     render(<App />)
//     expect(<App />).toBeTruthy()
// })

it('render', () => {
    let div = document.createElement('div')
    ReactDOM.render(<App />, div)

})