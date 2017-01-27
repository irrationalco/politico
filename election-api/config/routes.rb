require 'api_constraints'

Rails.application.routes.draw do
  resources :proyection_data
  namespace :api, defaults: { format: 'json' } do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: :true) do
      resources :users
      resources :organizations
      resources :proyections
    end
  end
end
