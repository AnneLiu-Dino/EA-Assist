import React from 'react'
import PromptList from './PromptList'

describe('<PromptList />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PromptList />)
  })
})