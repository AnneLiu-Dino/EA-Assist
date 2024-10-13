import React from 'react'
import LoadingMessage from './LoadingMessage'

describe('<LoadingMessage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LoadingMessage />)
  })
})