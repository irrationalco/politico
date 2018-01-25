require 'rails_helper'

RSpec.describe ProjectionsController, type: :routing do
  describe 'routing' do
    it 'routes to #index' do
      expect(get: '/projections').to route_to('projections#index')
    end

    it 'routes to #new' do
      expect(get: '/projections/new').to route_to('projections#new')
    end

    it 'routes to #show' do
      expect(get: '/projections/1').to route_to('projections#show', id: '1')
    end

    it 'routes to #edit' do
      expect(get: '/projections/1/edit').to route_to('projections#edit', id: '1')
    end

    it 'routes to #create' do
      expect(post: '/projections').to route_to('projections#create')
    end

    it 'routes to #update via PUT' do
      expect(put: '/projections/1').to route_to('projections#update', id: '1')
    end

    it 'routes to #update via PATCH' do
      expect(patch: '/projections/1').to route_to('projections#update', id: '1')
    end

    it 'routes to #destroy' do
      expect(delete: '/projections/1').to route_to('projections#destroy', id: '1')
    end
  end
end
