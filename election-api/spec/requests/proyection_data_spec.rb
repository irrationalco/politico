require 'rails_helper'

RSpec.describe "ProyectionData", type: :request do
  describe "GET /proyection_data" do
    it "works! (now write some real specs)" do
      get proyection_data_path
      expect(response).to have_http_status(200)
    end
  end
end
