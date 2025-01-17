require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.

# rubocop:disable Metrics/BlockLength
RSpec.describe MapsController, type: :controller do
  # This should return the minimal set of attributes required to create a valid
  # Map. As you add validations to Map, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) do
    skip('Add a hash of attributes valid for your model')
  end

  let(:invalid_attributes) do
    skip('Add a hash of attributes invalid for your model')
  end

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # MapsController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe 'GET #index' do
    it 'assigns all maps as @maps' do
      map = Map.create! valid_attributes
      get :index, params: {}, session: valid_session
      expect(assigns(:maps)).to eq([map])
    end
  end

  describe 'GET #show' do
    it 'assigns the requested map as @map' do
      map = Map.create! valid_attributes
      get :show, params: { id: map.to_param }, session: valid_session
      expect(assigns(:map)).to eq(map)
    end
  end

  describe 'GET #new' do
    it 'assigns a new map as @map' do
      get :new, params: {}, session: valid_session
      expect(assigns(:map)).to be_a_new(Map)
    end
  end

  describe 'GET #edit' do
    it 'assigns the requested map as @map' do
      map = Map.create! valid_attributes
      get :edit, params: { id: map.to_param }, session: valid_session
      expect(assigns(:map)).to eq(map)
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new Map' do
        expect do
          post :create, params: { map: valid_attributes }, session: valid_session
        end.to change(Map, :count).by(1)
      end

      it 'assigns a newly created map as @map' do
        post :create, params: { map: valid_attributes }, session: valid_session
        expect(assigns(:map)).to be_a(Map)
        expect(assigns(:map)).to be_persisted
      end

      it 'redirects to the created map' do
        post :create, params: { map: valid_attributes }, session: valid_session
        expect(response).to redirect_to(Map.last)
      end
    end

    context 'with invalid params' do
      it 'assigns a newly created but unsaved map as @map' do
        post :create, params: { map: invalid_attributes }, session: valid_session
        expect(assigns(:map)).to be_a_new(Map)
      end

      it "re-renders the 'new' template" do
        post :create, params: { map: invalid_attributes }, session: valid_session
        expect(response).to render_template('new')
      end
    end
  end

  describe 'PUT #update' do
    context 'with valid params' do
      let(:new_attributes) do
        skip('Add a hash of attributes valid for your model')
      end

      it 'updates the requested map' do
        map = Map.create! valid_attributes
        put :update, params: { id: map.to_param, map: new_attributes }, session: valid_session
        map.reload
        skip('Add assertions for updated state')
      end

      it 'assigns the requested map as @map' do
        map = Map.create! valid_attributes
        put :update, params: { id: map.to_param, map: valid_attributes }, session: valid_session
        expect(assigns(:map)).to eq(map)
      end

      it 'redirects to the map' do
        map = Map.create! valid_attributes
        put :update, params: { id: map.to_param, map: valid_attributes }, session: valid_session
        expect(response).to redirect_to(map)
      end
    end

    context 'with invalid params' do
      it 'assigns the map as @map' do
        map = Map.create! valid_attributes
        put :update, params: { id: map.to_param, map: invalid_attributes }, session: valid_session
        expect(assigns(:map)).to eq(map)
      end

      it "re-renders the 'edit' template" do
        map = Map.create! valid_attributes
        put :update, params: { id: map.to_param, map: invalid_attributes }, session: valid_session
        expect(response).to render_template('edit')
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the requested map' do
      map = Map.create! valid_attributes
      expect do
        delete :destroy, params: { id: map.to_param }, session: valid_session
      end.to change(Map, :count).by(-1)
    end

    it 'redirects to the maps list' do
      map = Map.create! valid_attributes
      delete :destroy, params: { id: map.to_param }, session: valid_session
      expect(response).to redirect_to(maps_url)
    end
  end
end
# rubocop:enable Metrics/BlockLength
