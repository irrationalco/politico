require 'api_constraints'

Rails.application.routes.draw do

  devise_for :users
  root 'welcome#index'
  
  namespace :api, defaults: { format: 'json' } do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: :true) do
      resources :users
      resources :sessions, only: [:create, :destroy]
      resources :sections
      resources :polls
      resources :organizations
      resources :suborganizations
      resources :projections
      resources :favorites
      resources :voters do
        post 'file_upload', on: :new
      end
      get '/current_user',  to: 'users#user_by_email'
    end
  end
end
