require 'api_constraints'

Rails.application.routes.draw do

  devise_for :users
  root 'welcome#index'
  
  namespace :api, defaults: { format: 'json' } do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: :true) do
      resources :users
      resources :sections
      resources :polls
      resources :organizations
      resources :projections
      resources :favorites
    end
  end
end
