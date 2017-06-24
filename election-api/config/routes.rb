require 'api_constraints'

Rails.application.routes.draw do
  namespace :api, defaults: { format: 'json' } do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: :true) do
      resources :users
      resources :organizations
      resources :projections
      resources :favorites
      resources :parties
      resources :candidates
      resources :people
      resources :polls do
        resources :sections
        resources :questions
        resources :answers
      end
    end
  end
end
